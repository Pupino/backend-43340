import { connect } from 'mongoose';
export async function connectMongo() {
  try {
    await connect(
      'mongodb+srv://<user>:<pswd>@cluster0.rpahgl8.mongodb.net/ecommerce?retryWrites=true&w=majority'
    );
    console.log('plug to mongo!');
  } catch (e) {
    console.log(e);
    throw 'can not connect to the db';
  }
}
