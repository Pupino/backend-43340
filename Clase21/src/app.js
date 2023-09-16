//modules
import express from 'express';
import 'express-async-errors';
import compression from 'express-compression';
import cors from 'cors';
import session from 'express-session';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import sessionFileStore from 'session-file-store';
//app utilities
import errorHandler from './middlewares/error.js';
import { iniPassport } from './config/passport.config.js';
import { __dirname } from './config.js';
import { connectMongo } from './Utils/connections.js';
import { entorno } from './config.js';
import { logger } from './Utils/logger.js';
import { twilioClient } from './Utils/messaging.js';
//Routers
import { viewsRouter } from './routes/views.router.js';
import { productsRouter } from './routes/products.router.js';
import { routerCarts } from './routes/carts.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { authRouter } from './routes/auth.router.js';
import userRouter from './routes/users.router.js';
import { recoversRouter } from './routes/recovers.router.js';

const FileStore = sessionFileStore(session);
var fileStoreOptions = {};
const app = express();

//Swagger API's documentation
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-Ui-Express';
const specs = swaggerJSDoc({
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Backend CoderHouse Deliverable',
      description: 'The Project is about an e-commerce demo',
      version: 1.0,
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
});
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

const PORT = entorno.PORT;
connectMongo(); //TO DO: handle this from factory when users.memory.js and DAO will be created

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//app.use(addLogger);

//http://expressjs.com/en/resources/middleware/session.html --> session-file-store A file system-based session store.
//https://www.npmjs.com/package/session-file-store
if ((entorno.PERSISTENCE = 'MONGO')) {
  app.use(
    session({
      //entorno.PERSISTENCE = MEMORY => store: new FileStore(fileStoreOptions),
      store: MongoStore.create({
        mongoUrl: entorno.MONGO_URL,
        //ttl: 15, //86400 * 7,
      }),
      secret: 'waVesD10s',
      resave: true,
      saveUninitialized: true,
    })
  );
} else if ((entorno.PERSISTENCE = 'MEMORY')) {
  app.use(
    session({
      store: new FileStore(fileStoreOptions),
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true,
    })
  );
}

//Configuracion del motor de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Archivos publicos
app.use(express.static(__dirname + '/public'));

//Passport
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

//Twilio
app.get('/sms', async (req, res) => {
  const result = await twilioClient.messages.create({
    body: 'Holissss desde node.js!',
    from: entorno.TWILIO_PHONE_NUMBER,
    to: entorno.TWILIO_TO_PHONE,
  });
  logger.debug(`sms entrypoint result: ${result}`);
  res.send('SMS sent');
});

//API's Endpoints
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', routerCarts);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/recovers', recoversRouter);
app.use('/loggerTest', (req, res) => {
  logger.debug('debug Log from loggerTest');
  logger.verbose('verbose Log from loggerTest');
  logger.http('http Log from loggerTest');
  logger.info('info Log from loggerTest');
  logger.warn('warn Log from loggerTest');
  logger.error('error Log from loggerTest');
  return res.status(200).json({
    status: 'success',
    msg: `check server console! and 'errors.log' file if you're on PROD`,
  });
});
app.use('/', viewsRouter);
app.get('*', (req, res) => {
  //res.render('login-form');
  return res.status(404).json({
    status: 'error',
    msg: 'Error: endpoint does not exist',
    data: 'https://http.cat/404',
  });
});

//Middleware errors
app.use(errorHandler);

const httpServer = app.listen(PORT, (req, res) => {
  logger.info(`App listening on port ${PORT} --> http://localhost:${PORT}/`);
});
