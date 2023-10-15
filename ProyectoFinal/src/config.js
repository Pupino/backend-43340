import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
console.log('__filename' + __filename);
console.log('__dirname' + __dirname);
export const entorno = { MODE: process.argv[2] };

if (process.argv[2] != 'DEV' && process.argv[2] != 'PROD') {
  console.log('por favor indique PROD o DEV');
  process.exit();
} else {
  console.log('entorno.MODE: ' + entorno.MODE);
}

dotenv.config({
  path: process.argv[2] === 'DEV' ? './.env.development' : './.env.production',
});

console.log('process.env.MONGO_URL: ' + process.env.MONGO_URL);

entorno.PORT = process.env.PORT;
entorno.MONGO_URL = process.env.MONGO_URL;
entorno.ADMIN_NAME = process.env.ADMIN_NAME;
entorno.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
entorno.GITHUB_CLIENTID = process.env.GITHUB_CLIENTID;
entorno.GITHUB_CLIENTSECRET = process.env.GITHUB_CLIENTSECRET;
entorno.GITHUB_CALLBACKURL = process.env.GITHUB_CALLBACKURL;
entorno.PERSISTENCE = process.env.PERSISTENCE;
entorno.GOOGLE_EMAIL = process.env.GOOGLE_EMAIL;
entorno.GOOGLE_PASS = process.env.GOOGLE_PASS;
entorno.TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
entorno.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
entorno.TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
entorno.TWILIO_TO_PHONE = process.env.TWILIO_TO_PHONE;
entorno.API_URL = process.env.API_URL;
