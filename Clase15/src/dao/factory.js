import { entorno } from '../config/config.js';
import mongoose from 'mongoose';

export let Contacts;

switch (entorno.PERSISTENCE) {
  case 'MONGO':
    console.log('Mongo connecte');

    mongoose.connect(entorno.MONGO_URL);
    const { default: ContactsMongo } = await import(
      './mongo/contacts.mongo.js'
    );
    Contacts = ContactsMongo;

    break;
  case 'MEMORY':
    console.log('Persistence with Memory');
    const { default: ContactsMemory } = await import(
      './memory/contacts.memory.js'
    );
    Contacts = ContactsMemory;

    break;
  default:
    break;
}
