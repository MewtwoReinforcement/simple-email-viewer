// const URI = process.env.MONGO_URI;
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const User = new Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
});

export default mongoose.model('User', User);
