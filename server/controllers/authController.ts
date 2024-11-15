import { RequestHandler } from 'express';
import { google } from 'googleapis';
import 'dotenv/config';

import User from '../models/userModel.ts';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth',
);

function isTokenExpired(expiryDate: number): boolean {
  return Date.now() >= expiryDate;
}

const refreshAccessToken = async (userId: string) => {
  const user = await User.findOne({ _id: userId });
  if (!user || !user.oauthTokens.refresh_token) {
    throw new Error('No refresh token found for this user');
  }

  try {
    const response = await oAuth2Client.refreshAccessToken();

    const accessToken = response.credentials.access_token;
    const refreshToken =
      response.credentials.refresh_token || user.oauthTokens.refresh_token;

    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    user.oauthTokens.access_token = accessToken;
    user.oauthTokens.refresh_token = refreshToken;
    user.oauthTokens.tokenExpiry = response.credentials.expiry_date
      ? new Date(response.credentials.expiry_date).getTime()
      : (user.oauthTokens.tokenExpiry = Date.now());

    await user.save();

    return accessToken;
  } catch (error) {
    throw new Error(`Error refreshing access token`);
  }
};

const authController: Record<string, RequestHandler> = {
  /**
   * Generates a new OAuth redirect url for initiating the OAuth process with google
   * @middleware
   * @param {string} res.locals.sessionId - The user's sessionId cookie value ( added to res.locals by cookieController.generateSessionId, )
   */
  initiateOAuth: (_req, res, next) => {
    if (!res.locals.sessionId)
      return next({
        log: 'authController.initiateOAuth: cannot get res.locals.sessionId ( are you sure you preceeded this with cookieController.generateSessionId middleware? )',
        status: 500,
        message: {
          err: 'A Server Error Has Occured',
        },
      });
    const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/contacts.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      state: res.locals.sessionId,
    });
    res.locals.oauthRedirectUrl = url;
    return next();
  },

  /**
   * Finalizes OAuth Login/Signup process
   * adds (or updates) a user to the database with their google auth tokens
   * @middleware
   * @param {string} req.query.code - The OAuth code sent to the redirect uri by google oauth api
   * @param {string} res.locals.googleId - Modfies to be the user's googleId (used as a userId)
   * @modifies {res.locals.googleId}
   */
  saveOAuthDetails: async (req, res, next) => {
    if (req.query.code !== undefined && typeof req.query.code === 'string') {
      const oAuthCode = req.query.code;
      const sessionId = req.query.state as string;

      try {
        const { tokens } = await oAuth2Client.getToken(oAuthCode);
        if (!tokens.access_token || !tokens.refresh_token) {
          return next({
            log:
              'authController.saveOAuthDetails: Missing access token or refresh token. ' +
              tokens,
            status: 400,
            message: {
              err: 'OAuth token missing required fields.',
            },
          });
        }

        const accessToken: string = tokens.access_token as string;
        const refreshToken: string = tokens.refresh_token as string;
        const expiryDate = tokens.expiry_date;

        oAuth2Client.setCredentials({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        const oauth2 = google.oauth2('v2');
        const userInfo = await oauth2.userinfo.v2.me.get({
          auth: oAuth2Client,
        });

        const { id, email } = userInfo.data;
        const user = await User.findOne({ email });

        if (user) {
          if (isTokenExpired(user.oauthTokens.tokenExpiry)) {
            const newAccessToken = await refreshAccessToken(user.id); //should we save this access token to the db?
            oAuth2Client.setCredentials({
              access_token: newAccessToken,
              refresh_token: user.oauthTokens.refresh_token,
            });
          }

          user.sessionId = sessionId;
          user.oauthTokens = {
            access_token: accessToken,
            refresh_token: refreshToken,
            tokenExpiry: expiryDate
              ? new Date(expiryDate).getTime()
              : Date.now(),
          };

          await user.save();
        } else {
          const newUser = new User({
            email,
            googleId: id,
            oauthTokens: {
              access_token: accessToken,
              refresh_token: refreshToken,
              tokenExpiry: expiryDate
                ? new Date(expiryDate).getTime()
                : Date.now(),
            },
            sessionId: sessionId,
          });
          await newUser.save();
        }

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
};

export default authController;
