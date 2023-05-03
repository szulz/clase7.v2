//@ts-check
const fs = require('fs');
const express = require('express');
const ProductManager = require('./productManager.js');
const { json } = require('express');
const productManager = new ProductManager();


const app = express()
const port = 8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
  try {
    const productos = await productManager.getProducts();
    const limit = req.query.limit;
    if (productos.length >= limit) {
      return res.status(200).send(productos.splice(0, limit));
    } else if (productos.length < limit) {
      return res.status(400).send(`the "limit" param is greater than the quantity of products`);
    }
    res.status(200).send(productos);
  } catch (error) {
    return console.log(error);
  };
});

app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  const product = await productManager.getProductById(JSON.parse(id));
  if (product) {
    return res.status(200).json(product);
  }
  return res.status(400).send('error');
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
});