import mongoose, { isValidObjectId, Schema } from 'mongoose';
import { sortWithIdOnTop } from 'utils';

import type { IPigDoc, IPigModel } from './pig.interface';

const pigSchema = new Schema<IPigDoc, IPigModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    style: {
      color: String,
      icon: String,
      _id: false
    },
    userId: {
      type: String,
      ref: 'User',
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

pigSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

pigSchema.virtual('period', {
  ref: 'Period',
  localField: '_id',
  foreignField: 'pigId'
});

const Pig = mongoose.model<IPigDoc, IPigModel>('Pig', pigSchema);

export default Pig;
