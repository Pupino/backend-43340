import { connect } from 'mongoose';
import { entorno } from '../config.js';
import { logger } from '../Utils/logger.js';
export async function connectMongo() {
  try {
    await connect(entorno.MONGO_URL);
    logger.info('plug to mongo!');
  } catch (e) {
    logger.error(JSON.stringify(e));
    throw 'can not connect to the db';
  }
}
