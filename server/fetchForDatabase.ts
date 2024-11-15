import { google } from 'googleapis';
import User, { IUser } from './models/userModel.ts';

import { ContactConfig, Message } from '../client/types.ts';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth',
);
/**
 *
 */
async function updateMessages(user: IUser): Promise<void> {
  try {
    oAuth2Client.setCredentials(user.oauthTokens);

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const result = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });
    const messages = await Promise.all(
      result.data.messages?.map(
        async (message): Promise<Message> =>
          (
            await gmail.users.messages.get({
              userId: 'me',
              id: message.id ?? undefined,
            })
          ).data as Message,
      ) ?? [],
    );
    for (const message of messages) {
      if (message.id && !user.messages.has(message.id))
        user.messages.set(message.id, message);
    }
  } catch (error) {
    console.error(
      `fetchForDatabase.updateMessages: {user: ${user.email}} ${error}`,
    );
  }
}

async function updateContacts(user: IUser): Promise<void> {
  try {
    oAuth2Client.setCredentials(user.oauthTokens);

    const people = google.people({ version: 'v1', auth: oAuth2Client });
    const config: ContactConfig = {
      resourceName: 'people/me',
      personFields: 'emailAddresses',
      pageSize: 100,
      requestSyncToken: true,
      syncToken: user.contactTokens.syncToken,
      pageToken: user.contactTokens.pageToken,
    };

    const result = await people.people.connections.list(config);
    const contacts = result.data.connections ?? [];

    for (const contact of contacts) {
      if (
        (contact.emailAddresses?.length ?? 0 > 0) &&
        !user.contacts.has(
          contact.emailAddresses![0].value ?? 'undefined emailAddress',
        )
      )
        // mongoose doesn't allow `.` in Map keys, so we need to convert them to `,` and convert back when we pull data out
        // (we can use ',' as a substitute because email addresses cannot contain commas, so we won't incorrectly replace on the reconversion to email address)
        // If this is not the case... we could store the actual email address in the map's value and continue converting the keys
        user.contacts.set(
          contact.emailAddresses![0].value!.replace(/\./g, ','),
          null,
        );
    }
  } catch (error) {
    console.error('fetchForDatabase.updateContacts: ' + error);
  }
}

export default async function () {
  // iterate through users in database, call getMessages and getContacts on each
  try {
    const users = await User.find();
    users.forEach(async user => {
      console.log('updating user:', user.email);
      await updateMessages(user);
      await updateContacts(user);
      await user.save();
    });
  } catch (error) {
    console.error(error);
  }
}
