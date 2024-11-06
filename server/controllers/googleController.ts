import { RequestHandler, Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import 'dotenv/config';
import Message from '../models/MessageModel.ts';
import Contacts from '../models/ContactsModel.ts';
import User from '../models/userModel.ts';
import { randomBytes } from 'crypto';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth'
);

function generateSessionId(): string {
  return randomBytes(16).toString('hex');
}

const googleController: Record<string, RequestHandler> = {
  /**
   * An Express Middleware Function
   *  that redirects the user to a google OAuth 2.0 signin link
   */
  initiateOAuth: (_req: Request, res: Response, _next: NextFunction) => {
    const sessionId = generateSessionId();
    const cookieOptions =
      process.env.NODE_ENV === 'production'
        ? { httpOnly: true, secure: true }
        : { httpOnly: true, secure: false };
    res.cookie('sessionId', sessionId, cookieOptions);
    const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/contacts.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      state: sessionId,
    });

    return res.redirect(url);
  },

  /**
   * An Express Middleware Function
   * Updates the global credentials for the googleapis
   * @param {string} req.query.code - The OAuth code sent to the redirect uri by google oauth api
   */
  saveOAuthDetails: async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.code !== undefined && typeof req.query.code === 'string') {
      const oAuthCode = req.query.code;
      const sessionId = req.query.state as string;
      const state = req.query.state as string;

      console.log('Received OAuth code:', oAuthCode);
      console.log('Received state from Google:', state);
      console.log('Session ID from cookie:', sessionId);
      console.log('Query Params:', req.query);

      try {
        const { tokens } = await oAuth2Client.getToken(oAuthCode);
        if (!tokens.access_token || !tokens.refresh_token) {
          return next({
            log: 'googleController.saveOAuthDetails: Missing access token or refresh token.',
            status: 400,
            message: {
              err: 'OAuth token missing required fields.',
            },
          });
        }

        const accessToken: string = tokens.access_token as string;
        const refreshToken: string | null = tokens.refresh_token
          ? tokens.refresh_token
          : null;

        oAuth2Client.setCredentials({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        //we are setting authentication globally to oAuth2Client for all future API requests
        google.options({ auth: oAuth2Client });
        //we are connecting and retrieving the authenticated users profile info
        const oauth2 = google.oauth2('v2');
        const userInfo = await oauth2.userinfo.v2.me.get({
          auth: oAuth2Client,
        });
        const { id, email } = userInfo.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          existingUser.oauthTokens = {
            access_token: accessToken,
            refresh_token: refreshToken,
          };
          existingUser.sessionId = sessionId;
          await existingUser.save();
        } else {
          const newUser = new User({
            email: email,
            googleId: id,
            oauthTokens: {
              access_token: accessToken,
              refresh_token: refreshToken,
            },
            sessionId: sessionId,
          });
          await newUser.save();
        }
        res.cookie('googleId', id, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000,
        });

        res.locals.googleId = id;
        return next();
      } catch (error) {
        return next({
          log:
            'googleController.saveOAuthDetails: error getting tokens from google oauth client' +
            error,
          status: 500,
          message: {
            err: 'Server Error Occurred while perfroming oauth checks',
          },
        });
      }
    } else
      return next({
        log:
          "googleController.saveOAuthDetails: Couldn't parse the code query string parameter from the redirected OAuth request [" +
          typeof req.query.code +
          ' : ' +
          req.query.code +
          ']',
        status: 400,
        message: {
          err: 'Malformed Request: Missing OAuth code',
        },
      });
  },

  /**
   * An Express Middleware Function
   * @param {undefined} res.locals.messages - sets this to an array of message strings
   * @modifies {string[]} res.locals.messages
   */
  getMessages: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const gmail = google.gmail('v1');
      const result = await gmail.users.messages.list({
        userId: userId,
        maxResults: 10,
      });

      const messages = result.data.messages || [];
      // console.log('Messages:');
      const messageData: {
        id: string | null;
        snippet: string | null;
        payload: Object | null;
      }[] = [];
      // res.locals.messages = messages.map(
      for (const message of messages) {
        // async (message) =>
        // (
        const content = await gmail.users.messages.get({
          userId: userId,
          id: message.id ?? 'no id',
        });
        const contentData = {
          id: content.data.id ?? null,
          snippet: content.data.snippet ?? null,
          payload: content.data.payload ?? null,
        };
        const newMessage = new Message(contentData);
        await newMessage.save();
        messageData.push(contentData);
        // ).data.payload?.body?.data,
        // );
      }
      res.locals.messages = messageData;
      return next();
    } catch (error) {
      return next({
        log: 'googleController.getMessages: ' + error,
        status: 500,
        message: {
          err: 'A Server Error occured while trying to retreive messages',
        },
      });
    }
  },
  getContacts: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const peopleApi = google.people('v1');
      const result = await peopleApi.people.connections.list({
        resourceName: userId,
        personFields: 'names,emailAddresses',
      });
      const googleContacts = result.data.connections || [];
      const dbContacts = await Contacts.find({ userId });

      for (const googleContact of googleContacts) {
        const contactData = {
          name: googleContact.names?.[0].displayName || null,
          email: googleContact.emailAddresses?.[0].value || null,
          userId: userId,
        };

        const dbContact = dbContacts.find(
          (contact) => contact.email === contactData.email
        );

        if (dbContact) {
          await dbContact.updateOne(contactData);
        } else {
          const newContact = new Contacts(contactData);
          await newContact.save();
        }
      } // not sure if there is a more efficient way
      res.locals.contacts = await Contacts.find({ userId: userId });
      return next();
    } catch (error) {
      return next({
        log: 'googleController.getContacts: ' + error,
        status: 500,
        message: {
          err: 'A Server Error occured while trying to retreive contacts',
        },
      });
    }
  },
  addContacts: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const { name, email } = req.body;
      const dbContact = await Contacts.findOne({ email, userId }); // only used email and userid to query since emails are unique
      if (!dbContact) {
        const newContact = new Contacts({ name, email, userId });
        await newContact.save();
        res.locals.contact = newContact; // not sure what to return
      } else {
        res.locals.contact = dbContact; // not sure what to return
      }
      return next();
    } catch (error) {
      return next({
        log: 'googleController.addContacts: ' + error,
        status: 500,
        message: {
          err: 'A Server Error occured while trying to add contacts',
        },
      });
    }
  },
  delContacts: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const { email } = req.body;
      const dbContact = await Contacts.findOne({ email, userId });
      if (!dbContact) {
        return next({
          log: 'googleController.delContact: Contact not found',
          status: 404,
          message: { err: 'Contact not in database' },
        });
      } else {
        await dbContact.deleteOne();
        res.locals.contacts = dbContact; //not sure what to return
      }
      return next();
    } catch (error) {
      return next({
        log: 'googleController.addContacts: ' + error,
        status: 500,
        message: {
          err: 'A Server Error occured while trying to add contacts',
        },
      });
    }
  },
};

export default googleController;
