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
  const productos = await productManager.getProducts();
  const limit = req.query.limit;
  if (!limit) {
    return res.status(200).send(productos);
  }
  res.send(productos.splice(0, limit));
  

});

app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  const product = await productManager.getProductById(JSON.parse(id));
  res.json(product)
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
});