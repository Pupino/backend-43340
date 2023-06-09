import express from 'express';
import handlebars from 'express-handlebars';
import { MsgModel } from './DAO/models/msgs.model.js';
import { routerProducts } from './routes/products.router.js';
import { routerCarts } from './routes/carts.router.js';
//import { routerViewRealTimeProducts } from './routes/real-time-products.view.router.js';
import { routerVistaChatSocket } from './routes/chat-socket.vista.router.js';
import { ProductManager } from './DAO/ProductManager.js';
const store = new ProductManager();

import { __dirname } from './path.js';
import { Server } from 'socket.io';
import { connectMongo } from './Utils/connections.js';
const app = express();
const port = 8080;

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CONFIGURACION DEL MOTOR DE HANDLEBARS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//archivos publicos
app.use(express.static(__dirname + '/public'));

//Endpoints
//HTML REAL TIPO VISTA
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

//VISTA Sockets
//app.use('/realtimeproducts', routerViewRealTimeProducts);
app.use('/vista/chat-socket', routerVistaChatSocket);

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'Error: endpoint does not exist',
    data: 'https://http.cat/404',
  });
});

const httpServer = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
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
