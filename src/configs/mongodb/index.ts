import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';

export async function connectMongodb() {
  const mongodbUrl = process.env.MONGODB_URL || '';

  try {
    await mongoose.connect(`${mongodbUrl}/piggies?retryWrites=true`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions);
    console.log('connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
}
