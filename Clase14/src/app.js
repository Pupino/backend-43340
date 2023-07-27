import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { MsgModel } from './DAO/models/msgs.model.js';
import { viewsRouter } from './routes/views.router.js';
import { routerProducts } from './routes/products.router.js';
import { routerCarts } from './routes/carts.router.js';
//import { routerViewRealTimeProducts } from './routes/real-time-products.view.router.js';
import { routerVistaChatSocket } from './routes/chat-socket.router.js';
import { ProductManager } from './DAO/ProductManager.js';
import { iniPassport } from './config/passport.config.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { authRouter } from './routes/auth.router.js';
import { __dirname } from './config.js';
import { Server } from 'socket.io';
import { connectMongo } from './Utils/connections.js';
import { entorno } from './config.js';
import { fork } from 'child_process';

const store = new ProductManager();

console.log(process.pid);
console.log(process.cwd());
console.log(process.argv);
console.log(process.argv[2]);
//console.log('Options: ', program.opts());
//console.log('Options port: ', program.opts().p);

const app = express();
// entorno.PORT
const PORT = entorno.PORT;

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/api/auth', authRouter);

//VISTA Sockets
//app.use('/realtimeproducts', routerViewRealTimeProducts);
app.use('/vista/chat-socket', routerVistaChatSocket);

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

app.get('/complex', (req, res) => {
  const child = fork('./src/pro2.js');
  child.send('Inicia el proceso!!');
  child.on('message', (result) => {
    res.send('El resultado de la operacion es ' + result);
  });
});

app.get('*', (req, res) => {
  //res.render('login-form');
  return res.status(404).json({
    status: 'error',
    msg: 'Error: endpoint does not exist',
    data: 'https://http.cat/404',
  });
});

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
