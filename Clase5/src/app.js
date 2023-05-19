//@ts-check
import express from 'express';
import { routerProducts } from './routes/products.router.js';
import { routerCarts } from './routes/carts.router.js';
import { __dirname } from './utils.js';

const app = express();
const port = 8080;

app.use(express.json()); //comunication config mode
app.use(express.urlencoded({ extended: true }));

//Public Files
app.use('/static', express.static(__dirname + '/public'));

//Endpoints
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'Error: endpoint does not exist',
    data: 'https://http.cat/404',
  });
});

app.listen(port, () => {
  console.log(`App up and running on port ${port}`);
});
