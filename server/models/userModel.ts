import { Schema, Document, model } from 'mongoose';
import { Message, Contact } from '../../client/types.ts';

export interface IUser extends Document {
  email: string;
  googleId: string;
  oauthTokens: {
    access_token: string | null | undefined;
    refresh_token: string | null;
    tokenExpiry: number;
  };
  sessionId: string;
  contacts: Map<Contact, null>;
  messages: Map<string, Message>;
  messageTokens: {
    gmailQuery: string;
    pageToken: string;
  };
  contactTokens: {
    syncToken: string;
    pageToken: string;
  };
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true, unique: true },
  oauthTokens: {
    access_token: { type: String, required: true, default: null },
    refresh_token: { type: String, required: true, default: null },
    tokenExpiry: { type: Number, required: true },
  },
  sessionId: { type: String, required: true },
  contacts: { type: Schema.Types.Map, required: true, default: new Map() },
  messages: { type: Schema.Types.Map, required: true, default: new Map() },
  messageTokens: {
    gmailQuery: { type: String, required: false },
    pageToken: { type: String, required: false },
  },
  contactTokens: {
    syncToken: { type: String, required: false },
    pageToken: { type: String, required: false },
  },
});

export default model<IUser>('User', userSchema);
