import { RequestHandler, Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import 'dotenv/config';
import User from '../models/userModel';
import { randomBytes } from 'crypto';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth',
);

function generateSessionId(): string {
  return randomBytes(16).toString('hex');
}

const googleController: Record<string, RequestHandler> = {
  /**
   * An Express Middleware Function
   *  that redirects the user to a google OAuth 2.0 signin link
   */
  initiateOAuth: (_req: Request, res: Response, next: NextFunction) => {
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
  getMessages: async (_req, res, next) => {
    try {
      const gmail = google.gmail('v1');
      const result = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
      });

      const messages = result.data.messages || [];
      console.log('Messages:');
      res.locals.messages = messages.map(
        async (message) =>
          (
            await gmail.users.messages.get({
              userId: 'me',
              id: message.id ?? 'no id',
            })
          ).data.payload?.body?.data,
      );
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
};

export default googleController;
