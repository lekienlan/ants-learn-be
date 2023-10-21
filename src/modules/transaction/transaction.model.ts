import paginate from 'middlewares/paginate';
import Period from 'modules/period/period.model';
import mongoose, { isValidObjectId, Schema } from 'mongoose';
import { sortWithIdOnTop } from 'utils';

import type {
  ITransactionDoc,
  ITransactionModel
} from './transaction.interface';

const transactionSchema = new Schema<ITransactionDoc, ITransactionModel>(
  {
    amount: {
      type: Number,
      required: true,
      trim: true
    },

    currency: {
      type: String,
      default: 'vnd'
    },
    date: {
      type: Date
    },
    note: {
      type: String
    },
    categoryId: {
      type: String,
      validate(value: string) {
        if (!isValidObjectId(value)) {
          throw new Error('Not valid');
        }
      }
    },
    type: {
      type: String,
      enum: ['income', 'budget', 'expense']
    },
    periodId: {
      type: String,
      validate(value: string) {
        if (!isValidObjectId(value)) {
          throw new Error('Not valid');
        }
      }
    },
    userId: {
      type: String,
      required: true,
      validate(value: string) {
        if (!isValidObjectId(value)) {
          throw new Error('Not valid');
        }
      }
    }
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

transactionSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

transactionSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
});

transactionSchema.virtual('period', {
  ref: 'Period',
  localField: 'periodId',
  foreignField: '_id',
  justOne: true
});

transactionSchema.plugin(paginate);

transactionSchema.post('save', async function (doc) {
  const period = await Period.findById(doc.periodId);

  if (period) {
    // Calculate the new total expenses by summing all expenses in the period
    const totalExpenses = await Transaction.aggregate([
      {
        $match: {
          periodId: doc.periodId,
          type: 'expense'
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    // Update the totalExpenses field in the associated Period
    await Period.updateOne(
      { _id: doc.periodId },
      { expense: totalExpenses?.[0]?.totalAmount || 0 }
    );
  }
});

const Transaction = mongoose.model<ITransactionDoc, ITransactionModel>(
  'Transaction',
  transactionSchema
);
export default Transaction;
