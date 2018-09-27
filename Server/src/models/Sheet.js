import mongoose, { Schema } from 'mongoose';

const SheetSchema = new Schema({
  text: {
    type: String,
    minlength: [5, 'Text need to be longer'],
    maxlength: [144, 'Text too long'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approveCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

SheetSchema.statics = {
  incApproveCount(sheetId) {
    return this.findByIdAndUpdate(sheetId, { $inc: { approveCount: 1 } }, { new: true });
  },
  decApproveCount(sheetId) {
    return this.findByIdAndUpdate(sheetId, { $inc: { approveCount: -1 } }, { new: true });
  }
}

export default mongoose.model('Sheet', SheetSchema);