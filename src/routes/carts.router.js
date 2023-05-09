const fs = require('fs');
const express = require('express');
const cartsRouter = express.Router();
const CartManager = require('../cartManager.js');
const cartManager = new CartManager();
const ProductManager = require('../productManager.js');
const productManager = new ProductManager();

//CREO NUEVO CARRO
cartsRouter.post('/', async (req, res) => {
    try {
        let cart = await cartManager.addCart();
        res.status(200).send({
            status: 'success',
            msg: `New cart created`,
            data: cart
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//MUESTRA PRODUCTOS EN EL CARRO POR ID DE CARRO : LISTO - SI EL CARRO ESTÁ VACIO!!! y si no se encuentra id
cartsRouter.get('/:cid', async (req, res) => {
    let cartProducts = await cartManager.getCartProductById(JSON.parse(req.params.cid))
    res.status(200).send({
        status: 'SUCCESS',
        msg: 'The following cart has been found',
        data: cartProducts
    })
})

//PASO ID DEL CARRO Y PRODUCTO CON SU ID : LISTO
cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    let allCarts = await cartManager.getCarts();
    const dataCartM = allCarts.find(c => c.id === JSON.parse(req.params.cid));
    let dataProductM = await productManager.getProductById(JSON.parse(req.params.pid));
    let checkId = dataCartM.products.find(p => p.id === JSON.parse(req.params.pid))
    if (checkId) {
        if (checkId.id === JSON.parse(req.params.pid)) {
            checkId.quantity++
            await cartManager.saveFile(allCarts)
            res.send(`Added to the cart`)
            return;
        }
    }
    dataCartM.products.push({ id: dataProductM.id, quantity: 1 });
    await cartManager.saveFile(allCarts);
    res.send('A new product has been added to the cart')
})


module.exports = cartsRouter;
