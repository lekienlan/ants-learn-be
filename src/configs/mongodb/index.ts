import configs from 'configs';
import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';

export async function connectMongodb() {
  const mongodbUrl = configs.mongoose.url || '';

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
