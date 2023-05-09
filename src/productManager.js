const { error } = require("console");
const fs = require("fs");
class ProductManager {
    constructor() {
        this.path = './src/productManager.json';
        this.products = [];
        this.id = 0;
    }
    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            throw new Error('All fields are mandatory');
        }
        const products = await this.getProducts();
        const checkCode = products.find(req => req.code === product.code);
        if (checkCode) {
            throw new Error('Code already in use, please try again with another code');
        }
        this.id = Math.floor(Math.random() * 10000);
        product.id = this.id;
        if (products.find(prod => prod.id === product.id)) {
            console.log('id repetido');
            product.id = Math.floor(Math.random() * 10000);
        };
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
    }
    async getProducts() {
        if (fs.existsSync(this.path)) {
            let productos = await fs.promises.readFile(this.path, "utf-8");
            const todosLosProductos = JSON.parse(productos);
            return todosLosProductos;
        } else {
            console.log('new file path has been created');
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), "utf-8");
            return this.products;
        }
    };
    async getProductById(id) {
        try {
            let allProducts = await this.getProducts();
            const prodToGet = allProducts.find(prod => prod.id === id);
            return prodToGet;
        } catch (error) {
            return error;
        }
    };

    async updateProduct(id, props) {
        let prodToUpdate = await this.getProducts();
        let newProd = prodToUpdate.find(prod => prod.id === id);
        const allowedProps = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        const prodKeys = Object.keys(props);
        for (let i = 0; i < prodKeys.length; i++) {
            if (!allowedProps.includes(prodKeys[i])) {
                throw new Error('There is one or more properties that do not coincide with the structure of the product');
            };
        };
        if (props.code) {
            props.code = parseInt(props.code, 10);
            const checkCode = prodToUpdate.find(req => req.code === props.code)
            if (checkCode) {
                throw new Error('There is another product with the same code, please try again with another code');
            };
        };
        let updatedProd = Object.assign(newProd, props);
        await fs.promises.writeFile(this.path, JSON.stringify(prodToUpdate, null, 2), "utf-8")
        return updatedProd;
    };
    async deleteProduct(id) {
        try {
            let todosLosProductos = await this.getProducts();
            let newProd = todosLosProductos.find(prod => prod.id === id);
            const index = todosLosProductos.findIndex(prod => prod.id === newProd.id)
            if (index !== -1) {
                todosLosProductos.splice(index, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(todosLosProductos, null, 2), "utf-8");
                return;
            }
        } catch (error) {
            return error;
        }
    };
}
/*
const productManager = new ProductManager("productManager.json");
const funcionAsync = async () => {
    await productManager.addProduct({
        title: 'Producto 1',
        description: 'Esto es el primer producto',
        price: 100,
        thumbnail: 'producto1.jpg',
        code: 1,
        stock: 15
    });
    await productManager.addProduct({
        title: 'Producto 2',
        description: 'Esto es el segundo producto',
        price: 900,
        thumbnail: 'producto2.jpg',
        code: 2,
        stock: 5
    });
    await productManager.addProduct({
        title: 'Producto 3',
        description: 'Esto es el tercer producto',
        price: 20,
        thumbnail: 'producto3.jpg',
        code: 3,
        stock: 90
    });
}

const callFunction = async () => {
    await productManager.getProducts();
    await productManager.getProductById(1);
    await productManager.deleteProduct(2);
    await productManager.updateProduct(3, {
        title: 'nuevo producto',
        stock: 0,
        description: 'nueva description',
        code: 85
    });

}
funcionAsync();
callFunction();
*/
module.exports = ProductManager;