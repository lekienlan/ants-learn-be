import mongoose, { isValidObjectId } from 'mongoose';

import type { ITokenDoc, ITokenModel } from './token.interface';

const tokenSchema = new mongoose.Schema<ITokenDoc, ITokenModel>(
  {
    token: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
      validate(value: string) {
        if (!isValidObjectId(value)) {
          throw new Error('Not valid');
        }
      }
    },

    expires: {
      type: Date,
      required: true
    },
    blacklisted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json

const Token = mongoose.model<ITokenDoc, ITokenModel>('Token', tokenSchema);

export default Token;
