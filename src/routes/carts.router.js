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

//MUESTRA PRODUCTOS EN EL CARRO POR ID DE CARRO 
cartsRouter.get('/:cid', async (req, res) => {
    try {
        let cartProducts = await cartManager.getCartProductById(JSON.parse(req.params.cid))
        if (!cartProducts) {
            throw new Error(`There is no cart asociated with the id ${req.params.cid} `)
        }
        res.status(200).send({
            status: 'SUCCESS',
            msg: 'The following cart has been found',
            data: cartProducts
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
})

//PASO ID DEL CARRO Y PRODUCTO CON SU ID
cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        let allCarts = await cartManager.getCarts();
        const dataCartM = allCarts.find(c => c.id === JSON.parse(req.params.cid));
        let dataProductM = await productManager.getProductById(JSON.parse(req.params.pid));
        if (!dataProductM || !dataCartM) {
            throw new Error(`Theres no product with the requested id, please try again with a valid id`)
        }
        let checkId = dataCartM.products.find(p => p.id === JSON.parse(req.params.pid))
        if (checkId) {
            if (checkId.id === JSON.parse(req.params.pid)) {
                checkId.quantity++
                await cartManager.saveFile(allCarts)
                res.status(200).send({
                    status: 'SUCCESS',
                    msg: 'You have added another product!',
                    data: dataCartM
                })
                return;
            }
        }
        dataCartM.products.push({ id: dataProductM.id, quantity: 1 });
        await cartManager.saveFile(allCarts);
        res.status(200).send({
            status: 'SUCCESS',
            msg: 'A new product has been added to the cart!',
            data: dataCartM
        })
    } catch (error) {
        res.status(404).send(error.message)
    }
})

//x si no ingreso ruta
cartsRouter.get('/', async (req, res) => {
    try {
        res.send({ msg: 'Heres a list with all the carts', data: await cartManager.getCarts() });
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = cartsRouter;
