import { Schema, Document, model } from 'mongoose';
import { NextFunction } from 'express';

interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model<IUser>('User', userSchema);

export default User;
