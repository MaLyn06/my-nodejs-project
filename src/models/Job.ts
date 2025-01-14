import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  url: string;
  status: 'pending' | 'completed' | 'failed';
  summary?: string;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

const JobSchema: Schema = new Schema({
  url: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  summary: { type: String },
  error_message: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

JobSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<IJob>('Job', JobSchema);
