import { promises as fs } from 'fs';

export class ProductsManager {
    constructor() {
        this.products = [];
        this.usedIds = new Set();
        this.path = './productos.json';
    }

    async writeProducts(data) {
        const datos = JSON.stringify(data, null, 4);
        await fs.writeFile(this.path, datos, 'utf8');
    }

    async readProducts() {
        try {
            const data = JSON.parse(await fs.readFile(this.path, 'utf-8'));
            data.forEach(producto => this.usedIds.add(producto.id));
            return data;
        } catch (error) {
            if (error) {
                return [];
            }
        }
    }

    async addProduct(product) {
        try {
            const products = await this.readProducts();
            //verificar si existe el producto
            const existingProduct = products.find(prod => prod.code === product.code);
            if (existingProduct && this.usedIds.has(product.id)) {
                throw new Error('el producto ya existe');
            } else {
                products.push(product);
                this.usedIds.add(product.id)
                console.log('producto agregado');
                await this.writeProducts(products);
            }
        } catch (error) {
            console.error('error al agregar el producto');
        }

    }

    async updatedProduct(productId, propertyName, newValue) {
        try {
            const productToUpdate = this.products.find((prod) => prod.id.toString() === productId);
            if (!productToUpdate) {
                throw new Error('producto no encontrado');
            } else {
                productToUpdate[propertyName] = newValue;

                const index = this.products.findIndex((prod) => prod.id.toString() === productId);
                if (index !== -1) {
                    this.products[index] = productToUpdate;
                    const productos = JSON.stringify(this.products, null, 4)
                    await this.writeProducts();
                }
            }
        } catch (error) {
            console.error('error', error.message);
        }
    }

    async getProductById(id) {
        const productId = this.products.find((prod) => prod.id.toString() === id);
        if (productId) {
            console.log('producto encontrado')
            console.log(productId);
        } else {
            console.log('Producto no encontrado');
            return null;
        }
        return productId;
    }

    async getProducts() {
        try{
            const products = await this.readProducts();
            // console.log(products)
            return products;
        } catch(error){
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const products = this.products.find((prod) => prod.id.toString() === id);
            if (products) {
                const prodsToDelete = this.products.filter(prod => prod.id.toString() !== id);
                this.products = prodsToDelete;
                await this.writeProducts();
            }
        } catch (error) {
            console.error('error', error);
        }
    }
}








