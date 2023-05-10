const fs = require('fs');
const express = require('express');
const productsRouter = express.Router();
const ProductManager = require('../productManager.js');
const productManager = new ProductManager();

// LIMITE O GETALL: LISTO
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

//GET X ID :  FALTA EL CASO SI LE PONGO UNA LETRA DE PARAMETRO!!!
productsRouter.get('/:id', async (req, res) => {
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
});


//CREA PROD Y CHECKEAR POR PROPS : LISTO / arreglar lo de thumbnail
productsRouter.post('/', async (req, res) => {
    try {
        const newProd = req.body;
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

//MODIFICAR PROPS: LISTO 
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

//BORRO POR ID: LISTO
productsRouter.delete('/:id', async (req, res) => {
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
});



module.exports = productsRouter;