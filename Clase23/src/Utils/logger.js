import winston from 'winston';
import { entorno } from '../config.js';

const loggerDev = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug', //debug + verbose + http + info + warn + error >> each of that levels on Dev will print on console
      format: winston.format.colorize({ all: true }),
    }),
  ],
});

const loggerProd = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info', //info + warn + error >> each of that levels on Prod will print on console
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: './errors.log',
      level: 'error', //error >> when error level on Prod will print on console and also on file
      format: winston.format.simple(),
    }),
  ],
});

let addLogger;
if (entorno.MODE === 'PROD') {
  addLogger = loggerProd;
} else {
  //entorno.MODE === 'DEV'
  addLogger = loggerDev;
}

export const logger = addLogger;
