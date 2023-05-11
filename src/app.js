const fs = require('fs');
const express = require('express');
const { json } = require('express');
const handlebars = require('express-handlebars')
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const path = require('path')




const app = express();
const port = 8080;

app.engine('handlebars', handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
});