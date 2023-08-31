import {Router} from "express";
import { Cart } from "../controllers/cart.js";
import { ProductsManager } from "../controllers/productsManager.js";

const cartRouter = Router();
const productManager = new ProductsManager();
const cart = new Cart('./cart.json');


cartRouter.post('/', async (req, res) => {
    try {
        await cart.createCart();
        const newCart = await cart.getProducts();
        res.status(200).send(`Carrito creado con exito ${JSON.stringify(newCart, null, 4)}`);
    } catch (error) {
        res.status(500).send('error');
    }
});


cartRouter.get('/:cid', async (req, res) => {
    try {
        const {cid} = req.params;
        const cartId = parseInt(cid);
        const cartProds = await cart.getCartById(cartId);
        if(cartProds){
            res.status(200).send(cartProds);
        } else {
            res.status(404).send('not found');
        }
        } catch (error) {
        res.status(500).send('error al cargar productos');
    }
})  




cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const {pid} = req.params;
        const productId = parseInt(pid);
        const newProd = {id: productId, quantity: 1};

        const productsFromJson = await productManager.getProducts();
        const productsFromCart = await cart.getProducts();

        const productJson = productsFromJson.find(prod => prod.id === productId);
        const productCart = productsFromCart.find(prod => prod.id === productId);
        if(productJson) {
            res.status(404).send('Ya existe un producto en base de datos con ese id');
        } else if (productCart) {
            await cart.addProduct(productCart);
            res.status(200).send(`cantidad de producto actualizado a ${productCart.quantity}`);
        } else {
            await cart.addProduct(newProd);
            res.status(200).send('producto creado con exito');
        }
    } catch (error) {
        res.status(500).send('error');
    }
});





export default cartRouter;