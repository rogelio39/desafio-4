
import { promises as fs } from 'fs';

export class Cart {
    constructor(){
        this.id = Cart.generadorId();
        this.products = [];
    }

    static generadorId() {
        if (this.idIncrement) {
            this.idIncrement++;
        } else {
            this.idIncrement = 1;
        }
        return this.idIncrement;
    }

}
export class cartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
    }


    async createCart(){
        const cart = new Cart();
        this.carts.push(cart);
        return cart;
    }

    async getCartById(id){
        const cart = this.carts.find(cart => cart.id === id);
        if(cart){
            return cart;
        } else {
            return false;
        }
    }

    async addProduct(cid, pid){
        const cart = this.getCartById(cid);
        const prodIndex = cart.products.findIndex(prod => prod.id === pid);
        if(prodIndex != -1){
            cart.products[prodIndex].quantity++;
        } else {
            cart.products.push({id : pid,  quantity: 1});
        }
        return true;
    }

}








