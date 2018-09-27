import mongoose, { Schema } from 'mongoose';

import Sheet from './Sheet';
import { SHEET_APPROVED } from '../graphql/resolvers/sheet-resolvers';
import { pubsub } from '../config/pubsub';

const ApproveSheetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  sheets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Sheet',
    },
  ],
});

ApproveSheetSchema.methods = {
  async userApprovedSheet(sheetId) {
    if (this.sheets.some(s => s.equals(sheetId))) {
      this.sheets.pull(sheetId);
      await this.save();

      const sheet = await Sheet.decApproveCount(sheetId);

      const s = sheet.toJSON();

      pubsub.publish(SHEET_ApprovED, { [SHEET_ApprovED]: { ...s } });

      return {
        isApproved: false,
        ...s,
      };
    }

    const sheet = await Sheet.incApproveCount(sheetId);

    const s = sheet.toJSON();

    this.sheets.push(sheetId);
    await this.save();
    pubsub.publish(SHEET_ApprovED, { [SHEET_ApprovED]: { ...s } });
    return {
      isApproved: true,
      ...s,
    };
  },
};

ApproveSheetSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model('ApproveSheet', ApproveSheetSchema);
