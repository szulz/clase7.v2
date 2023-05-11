const fs = require('fs');
const express = require('express');
const productsRouter = express.Router();
const ProductManager = require('../productManager.js');
const productManager = new ProductManager();
const uploader = require('../utils')


// LIMITE O GETALL
productsRouter.get('/', async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        const limit = req.query.limit;
        if (limit) {
            if (!Number(limit)) {
                throw new Error(`The limit parameter did not received a valid character`);
            };
        }
        if (productos.length >= limit) {
            return res.status(200).send({
                status: "SUCCESS",
                msg: `The amount of products request has been limited to the following ${limit} products`,
                data: productos.splice(0, limit)
            })
        } else if (productos.length < limit) {
            return res.status(400).send({
                status: "BAD REQUEST",
                msj: `Please try again with a different number between 0 to ${productos.length}.`
            });
        }
        return res.status(200).send({
            status: "SUCCESS",
            msg: `Here is a list with all the products!`,
            data: productos
        });
    } catch (error) {
        res.status(400).send(error.message);
    };
});

//GET X ID
productsRouter.get('/:id', async (req, res) => {
    try{
    const id = req.params.id;
    const product = await productManager.getProductById(JSON.parse(id));
    if (product) {
        return res.status(200).json({
            status: "SUCCESS",
            msg: `Product found with the matching id ${id}.`,
            data: product
        });
    }
    return res.status(404).send({
        status: "BAD REQUEST",
        msg: `There's no product matching with requested id.`
    });
}catch (error){
    res.status(404).send(error.message)
}
});


//CREA PROD Y CHECKEAR POR PROPS
productsRouter.post('/', uploader.single("thumbnail"), async (req, res) => {
    try {
        const newProd = req.body;
        newProd.thumbnail = "http://localhost:8080/" + req.file.filename
        await productManager.addProduct(newProd);
        return res.send({
            status: 'Product successfully added!',
            msg: `The following product has been added to the list:`,
            data: newProd
        });
    } catch (error) {
        res.status(400).send({
            status: 'BAD REQUEST',
            msg: error.message
        });
    };
});

//MODIFICAR PROPS
productsRouter.put('/:id', async (req, res) => {
    try {
        const idToUpdate = req.params.id;
        let prodProps = req.query;
        let updatedProd = await productManager.updateProduct(JSON.parse(idToUpdate), prodProps);
        res.status(200).send({
            status: 'SUCCESS',
            msg: 'The following product has been successfully updated',
            data: updatedProd
        });
    } catch (error) {
        res.status(400).send({
            status: 'BAD REQUEST',
            msg: error.message
        });
    };
});

//BORRO POR ID
productsRouter.delete('/:id', async (req, res) => {
    try{
    const id = req.params.id;
    let deletedProd = await productManager.getProductById(JSON.parse(id))
    if (deletedProd) {
        await productManager.deleteProduct(JSON.parse(id));
        return res.status(200).send({
            status: 'SUCCESS',
            msg: 'The following product has been deleted',
            data: deletedProd
        });
    }
    return res.status(404).send({
        status: 'BAD REQUEST',
        msg: `There's no product matching with requested id.`
    });
}catch(error){
    res.status(404).send(error.message)
}
});

productsRouter.get("/test/test", (req, res) => {
    const data = { name: 'Ezequiel', apellido: 'Szulz' }
    return res.status(200).render("usuarios", data)
})

module.exports = productsRouter;