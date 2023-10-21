import paginate from 'middlewares/paginate';
import { transactionService } from 'modules/transaction';
import mongoose, { Schema } from 'mongoose';
import { sortWithIdOnTop } from 'utils';

import type { IPeriodDoc, IPeriodModel } from './period.interface';

const periodSchema = new Schema<IPeriodDoc, IPeriodModel>(
  {
    startDate: Date,
    endDate: Date,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    budget: {
      type: Number,
      required: true
    },
    repeat: Boolean,
    status: String,
    pigId: mongoose.Schema.Types.ObjectId,
    expense: Number
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

periodSchema.plugin(paginate);

// periodSchema.virtual('expenses', {
//   ref: 'Transaction',
//   localField: '_id',
//   foreignField: 'periodId',
//   options: {
//     match: {
//       type: 'expense'
//     }
//   }
// });

periodSchema.post('save', async function (doc) {
  console.log(doc._id.toString(), doc.members?.[0]?.toString());
  await transactionService.create({
    periodId: doc._id.toString(),
    amount: (doc.budget || 0) * -1,
    type: 'budget',
    userId: doc.members?.[0]?.toString() || ''
  });
});

const Period = mongoose.model<IPeriodDoc, IPeriodModel>('Period', periodSchema);

export default Period;
