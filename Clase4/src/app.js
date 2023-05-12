//@ts-check
import express from 'express';
//const express = require('express');
const app = express();
const port = 8080;

app.use(express.json()); //comunication config mode
app.use(express.urlencoded({ extended: true }));

import { ProductManager } from './ProductManager.js';
const store = new ProductManager();

//por queryparam se recibira limite de resultados ?limit=
//ejemplo: /products/?limit=2
//si no se recibe devolver todos los resultados
app.get('/products', async (req, res) => {
  const limit = req.query.limit;
  const rta = await store.getProducts(limit);
  return res.status(rta.code).json({
    status: rta.status,
    message: rta.message,
  });
});

///products/:pid
//recibe por req.params el id y devuelve el producto solicitado
app.get('/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  const rta = await store.getProductById(pid);
  return res.status(rta.code).json({
    status: rta.status,
    message: rta.message,
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
