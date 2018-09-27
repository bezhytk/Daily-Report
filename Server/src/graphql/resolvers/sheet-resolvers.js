import Sheet from '../../models/Sheet';
import ApprovedSheet from '../../models/ApprovedSheet';
import { requireAuth } from '../../services/auth';
import { pubsub } from '../../config/pubsub';

const SHEET_ADDED = 'sheetAdded';
export const SHEET_APPROVED = 'sheetApproved';

export default {
  getSheet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);
      return Sheet.findById(_id);
    } catch (error) {
      throw error;
    }
  },
  getSheets: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      const p1 = Sheet.find({}).sort({ createdAt: -1 });
      const p2 = ApprovedSheet.findOne({ userId: user._id });
      const [sheets, approves] = await Promise.all([p1, p2]);

      const sheetsToSend = sheets.reduce((arr, sheet) => {
        const sh = sheet.toJSON();

        if (approves.sheets.some(t => t.equals(sheet._id))) {
          arr.push({
            ...sh,
            isApproved: true,
          });
        } else {
          arr.push({
            ...sh,
            isApproved: false,
          })
        }

        return arr;
      }, []);

      return sheetsToSend;
    } catch (error) {
      throw error;
    }
  },
  getUserSheets: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      return Sheet.find({ user: user._id }).sort({ createdAt: -1 })
    } catch (error) {
      throw error;
    }
  },
  createSheet: async (_, args, { user }) => {
    try {
      await requireAuth(user);
      const sheet = await Sheet.create({ ...args, user: user._id });

      pubsub.publish(SHEET_ADDED, { [SHEET_ADDED]: sheet });

      return sheet;
    } catch (error) {
      throw error;
    }
  },
  updateSheet: async (_, { _id, ...rest }, { user }) => {
    try {
      await requireAuth(user);
      const sheet = await Sheet.findOne({ _id, user: user._id });

      if (!sheet) {
        throw new Error('Not found!');
      }

      Object.entries(rest).forEach(([key, value]) => {
        sheet[key] = value;
      });

      return sheet.save();
    } catch (error) {
      throw error;
    }
  },
  deleteSheet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);
      const sheet = await Sheet.findOne({ _id, user: user._id });

      if (!sheet) {
        throw new Error('Not found!');
      }
      await sheet.remove();
      return {
        message: 'Delete Success!'
      }
    } catch (error) {
      throw error;
    }
  },
  approveSheet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);
      const approves = await ApproveSheet.findOne({ userId: user._id });

      return approves.userApproveSheet(_id);
    } catch (error) {
      throw error;
    }
  },
  sheetAdded: {
    subscribe: () => pubsub.asyncIterator(SHEET_ADDED)
  },
  sheetApproved: {
    subscribe: () => pubsub.asyncIterator(SHEET_APPROVED),
  }
};