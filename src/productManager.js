const fs = require("fs");
class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.id = 0
    }
    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.log('TODOS LOS CAMPOS SON OBLIGATORIOS');
            return;
        }
        const checkCode = this.products.find(req => req.code === product.code);
        if (checkCode) {
            console.log('CODIGO YA INGRESADO');
            return;
        }
        this.products.push(product);
        this.id++;
        product.id = this.id;
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), "utf-8");
    }
    async getProducts() {
        if (fs.existsSync(this.path)) {
            let productos = await fs.promises.readFile(this.path, "utf-8");
            const todosLosProductos = JSON.parse(productos);
            return todosLosProductos;
        }
        return 'error';
    }
    async getProductById(id) {
        let allProducts = await this.getProducts();
        const prodToGet = allProducts.find(prod => prod.id === id);
        return prodToGet;
    }
    async updateProduct(id, updateProps) {
        let prodToUpdate = await this.getProducts();
        let newProd = prodToUpdate.find(prod => prod.id === id);
        Object.assign(newProd, updateProps);
        await fs.promises.writeFile(this.path, JSON.stringify(prodToUpdate, null, 2), "utf-8");
        return;
    }
    async deleteProduct(id) {
        let todosLosProductos = await this.getProducts();
        let newProd = todosLosProductos.find(prod => prod.id === id);
        const index = todosLosProductos.findIndex(prod => prod.id === newProd.id)
        if (index !== -1) {
            todosLosProductos.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(todosLosProductos, null, 2), "utf-8");
            return;
        }
        return 'error';
    }
}

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
    /*
    await productManager.getProductById(1);
    await productManager.deleteProduct(2);
    await productManager.updateProduct(3, {
        title: 'nuevo producto',
        stock: 0,
        description: 'nueva description',
        code: 85
    });
    */
}
//funcionAsync();
//callFunction();