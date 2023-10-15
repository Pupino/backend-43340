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
//Routers
import { viewsRouter } from './routes/views.router.js';
import { productsRouter } from './routes/products.router.js';
import { routerCarts } from './routes/carts.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { authRouter } from './routes/auth.router.js';
import userRouter from './routes/users.router.js';
import { recoversRouter } from './routes/recovers.router.js';
import { smsRouter } from './routes/sms.router.js';

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
connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //cors open

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: entorno.MONGO_URL,
      //ttl: 15, //86400 * 7,
    }),
    secret: 'waVesD10s',
    resave: true,
    saveUninitialized: true,
  })
);

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

//API's Endpoints
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', routerCarts);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/recovers', recoversRouter);
app.use('/api/sms', smsRouter);
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
