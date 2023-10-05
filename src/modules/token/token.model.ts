import mongoose from 'mongoose';

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
      required: true
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
