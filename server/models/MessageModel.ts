import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

interface MessageType extends Document {
  id: string;
  snippet: string;
  payload: object;
}
const Message = new Schema<MessageType>({
  id: { type: String, required: true },
  snippet: { type: String },
  payload: { type: Object },
});

export default mongoose.model('Message', Message);
