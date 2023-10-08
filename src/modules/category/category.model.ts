import paginate from 'middlewares/paginate';
import mongoose, { Schema } from 'mongoose';

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
    icon: {
      type: String
    },
    color: {
      type: String
    },
    userId: {
      type: String,
      ref: 'User'
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

categorySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

categorySchema.plugin(paginate);

const Category = mongoose.model<ICategoryDoc, ICategoryModel>(
  'Category',
  categorySchema
);

export default Category;
