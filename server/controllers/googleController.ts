import { RequestHandler } from 'express';
import User from '../models/userModel.ts';

const googleController: Record<string, RequestHandler> = {
  /**
   * Returns the email messages for the specified user
   * @middleware
   * @param {string} req.params.id - The googleId for the user
   * @param {undefined} res.locals.messages - sets this to an array of message strings
   * @modifies {string[]} res.locals.messages
   */
  getMessages: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const dbUser = await User.findOne({ googleId: userId });
      if (dbUser) {
        // const messages: Message[] = [];
        // dbUser.messages.forEach(message => messages.push(message));
        res.locals.messages = Array.from(dbUser.messages.values());
      } else {
        return next({
          log:
            'googleController.getMessages: Could not find user with id=' +
            userId +
            ' in the database ',
          status: 404,
          message: {
            err: 'That resource is unvailable',
          },
        });
      }

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
      const dbUser = await User.findOne({ googleId: userId });
      if (!dbUser)
        return next({
          log:
            'googleController.getContacts: Could not find user with id=' +
            userId +
            ' in the database ',
          status: 500,
          message: {
            err: 'A Server Error occured while trying to retreive contacts',
          },
        });
      // cannot store keys with `.` in them in a mongoose database, so we change them to `,` and need to convert back here
      res.locals.contacts = Array.from(dbUser.contacts.keys()).map(email =>
        email.replace(/,/g, '.'),
      );
      return next();
    } catch (error) {
      return next({
        log: 'googleController.getContacts: ' + error,
        status: 404,
        message: {
          err: 'That resource is unavailable',
        },
      });
    }
  },

  // addContacts: async (req, res, next) => {
  //   try {
  //     const userId = req.params.id;
  //     const { name, email } = req.body;
  //     const dbContact = await Contacts.findOne({ email, userId }); // only used email and userid to query since emails are unique
  //     if (!dbContact) {
  //       const newContact = new Contacts({ name, email, userId });
  //       await newContact.save();
  //       res.locals.contact = newContact; // not sure what to return
  //     } else {
  //       res.locals.contact = dbContact; // not sure what to return
  //     }
  //     return next();
  //   } catch (error) {
  //     return next({
  //       log: 'googleController.addContacts: ' + error,
  //       status: 500,
  //       message: {
  //         err: 'A Server Error occured while trying to add contacts',
  //       },
  //     });
  //   }
  // },
  // delContacts: async (req, res, next) => {
  //   try {
  //     const userId = req.params.id;
  //     const { email } = req.body;
  //     const dbContact = await Contacts.findOne({ email, userId });
  //     if (!dbContact) {
  //       return next({
  //         log: 'googleController.delContact: Contact not found',
  //         status: 404,
  //         message: { err: 'Contact not in database' },
  //       });
  //     } else {
  //       await dbContact.deleteOne();
  //       res.locals.contacts = dbContact; //not sure what to return
  //     }
  //     return next();
  //   } catch (error) {
  //     return next({
  //       log: 'googleController.addContacts: ' + error,
  //       status: 500,
  //       message: {
  //         err: 'A Server Error occured while trying to add contacts',
  //       },
  //     });
  //   }
  // },
};

export default googleController;
