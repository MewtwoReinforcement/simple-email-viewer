import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

interface ContactType extends Document {
  name: string;
  email: string;
}

const Contact = new Schema<ContactType>({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model('Contact', Contact);
