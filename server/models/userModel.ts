import { Schema, Document, model } from 'mongoose';

interface IUser extends Document {
  email: string;
  googleId: string;
  oauthTokens: {
    access_token: string | null;
    refresh_token: string | null;
  };
  sessionId: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true, unique: true },
  oauthTokens: {
    access_token: { type: String, required: true, default: null },
    refresh_token: { type: String, required: true, default: null },
  },
  sessionId: { type: String, required: true },
});

const User = model<IUser>('User', userSchema);

export default User;
