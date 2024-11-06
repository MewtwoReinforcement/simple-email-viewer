import { Schema, Document, model } from 'mongoose';
import { Message, Contact } from '../../client/types.ts';

export interface IUser extends Document {
  email: string;
  googleId: string;
  oauthTokens: {
    access_token: string | null | undefined;
    refresh_token: string | null;
  };
  sessionId: string;
  contacts: Set<Contact>;
  messages: Map<string, Message>;
  tokenExpiry: number;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true, unique: true },
  oauthTokens: {
    access_token: { type: String, required: true, default: null },
    refresh_token: { type: String, required: true, default: null },
  },
  sessionId: { type: String, required: true },
  contacts: { type: Schema.Types.Mixed, required: true, default: new Set() },
  messages: { type: Schema.Types.Map, required: true, default: new Map() },
  tokenExpiry: { type: Number, required: true },
});

const User = model<IUser>('User', userSchema);

export default User;
