
import { promises as fs } from 'fs';

export class cartManager {
    constructor(path) {
        this.products = [];
        this.path = path;
        this.id = cartManager.generadorId();
    }   
    
    
    static generadorId() {
        if (this.idIncrement) {
            this.idIncrement++;
        } else {
            this.idIncrement = 1;
        }
        return this.idIncrement;
    }

    async createCart() {
        const datos = JSON.stringify({idCart: this.id, productsCart: this.products}, null, 4);
        await fs.writeFile(this.path, datos, 'utf8');
    }

    
    async readProducts() {
        try {
            const data = JSON.parse(await fs.readFile(this.path, 'utf-8'));
            this.products = data;
            return this.products;
        } catch (error) {
            if (error) {
                this.products = [];
            }
        }
    }

    async writeFile() {
        const datos = JSON.stringify(this.products, null, 4);
        await fs.writeFile(this.path, datos, 'utf8');
    }

    async addProduct(id) {
        try {
            // Verificar si existe el producto
            const existingProductIndex = this.products.productsCart.findIndex(prod => prod.id === id);
    
            if (existingProductIndex !== -1) {
                // Producto ya existe, aumentar cantidad
                this.products.productsCart[existingProductIndex].quantity++;
                await this.writeFile();
                return true;
            } else {
                // Producto no existe, agregarlo al array
                this.products.productsCart.push({id : id, quantity: 1});
                console.log('Producto agregado');
                await this.writeFile();
                return true;
            }
        } catch (error) {
            console.error('Error al agregar el producto');
        }
    

}

    async getCartById(id) {
        this.products = await this.readProducts();
        if (this.id === id) {
            console.log('carrito encontrado')
            return this.products;
        } else {
            console.log('carrito no encontrado');
            return null;
        }
    }


    async getProducts() {
        const products = await this.readProducts();
        const productId = products.productsCart;
        return productId;
    }

}








