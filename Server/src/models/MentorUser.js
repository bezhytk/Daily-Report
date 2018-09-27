import mongoose, { Schema } from 'mongoose';

const MentorUserSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  mentors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

MentorUserSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model('MentorUser', MentorUserSchema);