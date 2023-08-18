//@ts-check
import express from 'express';
import 'express-async-errors';
import compression from 'express-compression';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import cors from 'cors';
import session from 'express-session';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import errorHandler from './middlewares/error.js';
import { iniPassport } from './config/passport.config.js';
import { __dirname } from './config.js';
import { Server } from 'socket.io';
import { connectMongo } from './Utils/connections.js';
import { entorno } from './config.js';
import { fork } from 'child_process';
import { MsgModel } from './dao/mongo/models/msgs.model.js';
//ROUTERS
import { viewsRouter } from './routes/views.router.js';
import { productsRouter } from './routes/products.router.js';
import { routerCarts } from './routes/carts.router.js';
import { routerVistaChatSocket } from './routes/chat-socket.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { authRouter } from './routes/auth.router.js';
import userRouter from './routes/users.router.js';
//import { routerViewRealTimeProducts } from './routes/real-time-products.view.router.js';
//import { ProductManager } from './dao/memory/products.memory.js';
import sessionFileStore from 'session-file-store';
const FileStore = sessionFileStore(session);
var fileStoreOptions = {};

console.log(process.pid);
console.log(process.cwd());
console.log(process.argv);
console.log(process.argv[2]);
//console.log('Options: ', program.opts());
//console.log('Options port: ', program.opts().p);

const app = express();
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);
// entorno.PORT
const PORT = entorno.PORT;

connectMongo(); //TO DO: handle this from factory when users.memory.js and DAO will be created

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

//CONFIGURACION DEL MOTOR DE HANDLEBARS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//archivos publicos
app.use(express.static(__dirname + '/public'));

//TODO LO DE PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());
//FIN TODO LO DE PASSPORT

//Endpoints
//HTML REAL TIPO VISTA
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', routerCarts);
app.use('/api/auth', authRouter);

//VISTA Sockets
//app.use('/realtimeproducts', routerViewRealTimeProducts);
app.use('/vista/chat-socket', routerVistaChatSocket);

///////////////////////////////
//Setteo para envio de mail
const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: { user: entorno.GOOGLE_EMAIL, pass: entorno.GOOGLE_PASS },
});

app.get('/mail', async (req, res) => {
  //console.log('entro a mail');
  let result = await transport.sendMail({
    from: 'romina.jalon@gmail.com',
    to: 'romina.jalon@gmail.com',
    subject: 'Surfing =)',
    html: '<div><h1>Así surfean los pro! </h1><img src="cid:SurfKangaroo" /></div>',
    attachments: [
      {
        filename: 'SurfKangaroo.jpg',
        path: __dirname + '/images/SurfKangaroo.jpg',
        cid: 'SurfKangaroo',
      },
    ],
  });
  //console.log(`Result: ${result}`);
  res.send('Email sent');
});
///////////////////////////////
//Seteo Twilio
const client = twilio(entorno.TWILIO_ACCOUNT_SID, entorno.TWILIO_AUTH_TOKEN);

app.get('/sms', async (req, res) => {
  const result = await client.messages.create({
    body: 'Holissss desde node.js!',
    from: entorno.TWILIO_PHONE_NUMBER,
    to: entorno.TWILIO_TO_PHONE,
  });

  //console.log(`Result: ${result}`);
  res.send('SMS sent');
});
///////////////////////////////

//Faker
app.use('/api/users', userRouter);

app.get('/complex', (req, res) => {
  const child = fork('./src/pro2.js');
  child.send('Inicia el proceso!!');
  child.on('message', (result) => {
    res.send('El resultado de la operacion es ' + result);
  });
});

app.use('/', viewsRouter);
// app.get('/session', (req, res) => {
//   if (req.session.counter) {
//     req.session.counter++;
//     res.send(`Site visited ${req.session.counter} times`);
//   } else {
//     req.session.counter = 1;
//     res.send('Welcome!');
//   }
// });

// app.get('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (!err) res.send('Logout ok!');
//     else res.send({ status: 'Logout ERROR', body: err });
//   });
// });

app.get('*', (req, res) => {
  //res.render('login-form');
  return res.status(404).json({
    status: 'error',
    msg: 'Error: endpoint does not exist',
    data: 'https://http.cat/404',
  });
});

//MIDDLEWARE ERRORS
app.use(errorHandler);

const httpServer = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} --> http://localhost:${PORT}/`);
});

const socketServer = new Server(httpServer);
socketServer.on('connection', (socket) => {
  socket.on('msg_front_to_back', async (msg) => {
    const msgCreated = await MsgModel.create(msg);
    const msgs = await MsgModel.find({});
    socketServer.emit('todos_los_msgs', msgs);
  });
});

/*
export const socketServer = new Server(httpServer);
socketServer.on('connection', (socket) => {
  socket.on('create_product_on_backend', async (msg) => {
    let msgToSend;
    try {
      //call promise to add product
      const rta = await store.addProduct(msg.newProduct);
      //check rta
      if (rta.status == 'success') {
        msgToSend = await store.getProducts();
      } else {
        msgToSend = rta; //seng msg with error details on product creation
      }
    } catch (error) {
      msgToSend = {
        code: 404,
        status: 'error',
        details: error,
      };
    }
    socketServer.emit('product_created', msgToSend);
  });

  socket.on('delete_product_on_backend', async (msg) => {
    let msgToSend;
    try {
      const rta = await store.deleteProduct(msg.productId);
      if (rta.status == 'success') {
        msgToSend = rta;
        const products = await store.getProducts();
        msgToSend.products = products.details;
      }
    } catch (error) {
      msgToSend = {
        code: 404,
        status: 'error',
        details: error,
      };
    }
    socketServer.emit('product_deleted', msgToSend);
  });
});*/
