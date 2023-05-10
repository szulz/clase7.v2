const fs = require("fs");

class CartManager {
    constructor() {
        this.path = './src/db/cartManager.json';
        this.cart = [];
    };
    async addCart() {
        const id = Math.floor(Math.random() * 10000);
        let products = [];
        let cart = { products, id };
        if (this.cart.find(c => c.id === cart.id)) {
            throw new Error('There was an internal error creating the id, please try again');
        };
        let allCarts = await this.getCarts();
        allCarts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2), "utf-8");
        return cart;
    };
    async getCarts() {
        if (fs.existsSync(this.path)) {
            let carts = await fs.promises.readFile(this.path, "utf-8");
            const allCarts = JSON.parse(carts);
            return allCarts;
        } else {
            console.log('new file path has been created');
            await fs.promises.writeFile(this.path, JSON.stringify(this.cart, null, 2), "utf-8");
            return this.cart;
        }
    };
    async getCartProductById(id) {
        try {
            let allCarts = await this.getCarts();
            const cartProd = allCarts.find(c => c.id === id);
            return cartProd;
        } catch (error) {
            return error;
        }
    };
    async saveFile(file) {
        if (fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, JSON.stringify(file, null, 2), "utf-8")
            return
        }
    }
};

module.exports = CartManager;