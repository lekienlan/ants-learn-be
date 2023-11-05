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

const Period = mongoose.model<IPeriodDoc, IPeriodModel>('Period', periodSchema);

export default Period;
