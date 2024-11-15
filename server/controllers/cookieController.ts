import { randomBytes } from 'crypto';
import { RequestHandler } from 'express';
import 'dotenv/config';

function generateSessionId(): string {
  return randomBytes(16).toString('hex');
}

const cookieController: Record<string, RequestHandler> = {
  /**
   * Sets the cookie for the googleId on res.locals
   * @middleware
   * @param {string} res.locals.googleId - The googleId value to set the cookie to
   * @param {string} res.cookie.googleId - This will be modified to have the passed googleId
   * @modifies {res.cookie.googleId}
   */
  setGoogleId: (_req, res, next) => {
    if (res.locals.googleId) {
      res.cookie('googleId', res.locals.googleId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });
    }

    return next();
  },

  /**
   * generates a sessionId cookie if one does not already exist
   * @middleware
   * @param {string?} req.cookies.sessionId - The existing sessionId cookie
   * @param {string} res.cookie.sessionId - Will be modified to have newly generated sessionId cookie, which the client will overwrite in on receiving the response
   * @modifies {res.cookie.sessionId}
   * @param {string} res.locals.sessionId - Will be modified to have newly generated sessionId cookie
   * @modifies {res.locals.sessionId}
   */
  generateSessionId: (req, res, next) => {
    if (!req.cookies.sessionId) {
      const sessionId = generateSessionId();
      const cookieOptions =
        process.env.NODE_ENV === 'production'
          ? { httpOnly: true, secure: true }
          : { httpOnly: true, secure: false };

      res.cookie('sessionId', sessionId, cookieOptions);
      res.locals.sessionId = sessionId;
    } else res.locals.sessionId = req.cookies.sessionId;
    return next();
  },
};

export default cookieController;
