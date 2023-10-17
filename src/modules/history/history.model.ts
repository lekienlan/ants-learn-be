import paginate from 'middlewares/paginate';
import mongoose, { Schema } from 'mongoose';
import { sortWithIdOnTop } from 'utils';

import type { IHistoryDoc, IHistoryModel } from './history.interface';

const historySchema = new Schema<IHistoryDoc, IHistoryModel>(
  {
    transactionId: String,
    data: {
      amount: Number,
      userId: String,
      categoryId: String,
      date: Date,
      note: String,
      currency: String,
      periodId: String
    },
    state: String
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_, ret) {
        delete ret?._id;
        return sortWithIdOnTop(ret);
      }
    }
  }
);

historySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

historySchema.plugin(paginate);

const History = mongoose.model<IHistoryDoc, IHistoryModel>(
  'History',
  historySchema
);

export default History;
