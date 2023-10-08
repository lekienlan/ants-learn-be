import paginate from 'middlewares/paginate';
import mongoose, { Schema } from 'mongoose';

import type { IIncomeDoc, IIncomeModel } from './income.interface';

const incomeSchema = new Schema<IIncomeDoc, IIncomeModel>(
  {
    amount: {
      type: Number,
      required: true,
      trim: true
    },
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    unit: {
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
      ref: 'Category'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_, ret) {
        delete ret?._id;
      }
    }
  }
);

incomeSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});
incomeSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
});

incomeSchema.plugin(paginate);

const Income = mongoose.model<IIncomeDoc, IIncomeModel>('Income', incomeSchema);

export default Income;
