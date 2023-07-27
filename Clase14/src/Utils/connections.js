import { connect } from 'mongoose';
import { entorno } from '../config.js';
export async function connectMongo() {
  try {
    await connect(entorno.MONGO_URL);
    console.log('plug to mongo!');
  } catch (e) {
    console.log(e);
    throw 'can not connect to the db';
  }
}
