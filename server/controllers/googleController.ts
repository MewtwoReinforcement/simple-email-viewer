import { RequestHandler } from 'express';
import { google } from 'googleapis';
import 'dotenv/config';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth',
);

const googleController: Record<string, RequestHandler> = {
  /**
   * An Express Middleware Function
   *  that redirects the user to a google OAuth 2.0 signin link
   */
  initiateOAuth: (_req, res, _next) => {
    const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/contacts.readonly',
      ],
    });

    return res.redirect(url);
  },

  /**
   * An Express Middleware Function
   * Updates the global credentials for the googleapis
   * @param {string} req.query.code - The OAuth code sent to the redirect uri by google oauth api
   */
  saveOAuthDetails: async (req, _res, next) => {
    if (req.query.code !== undefined && typeof req.query.code === 'string') {
      const oAuthCode = req.query.code;
      try {
        const { tokens } = await oAuth2Client.getToken(oAuthCode);
        oAuth2Client.setCredentials(tokens);
        google.options({ auth: oAuth2Client });
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

module.exports = googleController;
