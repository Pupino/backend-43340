import { connect } from 'mongoose';
export async function connectMongo() {
  try {
    await connect('');
    console.log('plug to mongo!');
  } catch (e) {
    console.log(e);
    throw 'can not connect to the db';
  }
}
