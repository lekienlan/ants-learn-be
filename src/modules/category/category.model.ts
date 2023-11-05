import mongoose, { isValidObjectId, Schema } from 'mongoose';
import { sortWithIdOnTop } from 'utils';

import type { ICategoryDoc, ICategoryModel } from './category.interface';

const categorySchema = new Schema<ICategoryDoc, ICategoryModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      ref: 'User'
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

categorySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

const Category = mongoose.model<ICategoryDoc, ICategoryModel>(
  'Category',
  categorySchema
);

export default Category;
