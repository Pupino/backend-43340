import express from 'express';
import handlebars from 'express-handlebars';
//import { routerProducts } from './routes/products.router.js';
import { routerViewProducts } from './routes/products.view.router.js';
import { routerViewRealTimeProducts } from './routes/real-time-products.view.router.js';
import { ProductManager } from './ProductManager.js';
const store = new ProductManager();

import { __dirname } from './utils.js';
import { Server } from 'socket.io';
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CONFIGURACION DEL MOTOR DE HANDLEBARS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//archivos publicos
app.use(express.static(__dirname + '/public'));

//HTML REAL TIPO VISTA
app.use('/products', routerViewProducts);

//VISTA Sockets
app.use('/realtimeproducts', routerViewRealTimeProducts);

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'error esa ruta no existe',
    data: {},
  });
});

const httpServer = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

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
});
