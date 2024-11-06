import { google } from 'googleapis';
import User, { IUser } from './models/userModel.ts';

import { Message } from '../client/types.ts';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth',
);
/**
 *
 */
const updateMessages = async (user: IUser): Promise<void> => {
  try {
    oAuth2Client.setCredentials(user.oauthTokens);

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const result = await gmail.users.messages.list({
      userId: user.googleId,
      maxResults: 10,
    });
    const messages =
      (await result.data.messages?.map(
        async (message) =>
          await gmail.users.messages.get({
            userId: 'me',
            id: message.id ?? undefined,
          }),
      )) ?? [];

    for (const message of await Promise.all(messages)) {
      if (message.data.id && !user.messages.has(message.data.id))
        user.messages.set(message.data.id, message.data as Message);
    }
  } catch (error) {
    console.error('fetchForDatabase.updateMessages: ' + error);
  }
};

const updateContacts = async (user: IUser): Promise<void> => {
  try {
    oAuth2Client.setCredentials(user.oauthTokens);

    const people = google.people({ version: 'v1', auth: oAuth2Client });
    const result = await people.people.connections.list({
      resourceName: 'me',
      personFields: 'emailAddresses',
    });
    const contacts = result.data.connections ?? [];

    for (const contact of contacts) {
      if (
        contact.emailAddresses &&
        contact.emailAddresses[0].value &&
        !user.contacts.has(contact.emailAddresses[0].value)
      )
        user.contacts.add(contact.emailAddresses[0].value);
    }
  } catch (error) {
    console.error('fetchForDatabase.updateContacts: ' + error);
  }
};

export default async function () {
  // iterate through users in database, call getMessages and getContacts on each
  try {
    const users = await User.find();
    users.forEach((user) => {
      updateMessages(user);
      updateContacts(user);
    });
  } catch (error) {
    console.error(error);
  }
}
