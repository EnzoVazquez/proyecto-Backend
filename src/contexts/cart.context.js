import e from 'express';
import fs from 'fs';
import __dirname from '../utils.js';
import productContext from './productos.context.js'

const utilidades = new productContext();

class cartContext {
    constructor(){
        this.path = __dirname + '/files/cart.json'
    }

    //traer todos los carritos
    getAll = async() =>{
       try {
        if(fs.existsSync(this.path)){
            let data = await fs.promises.readFile(this.path, 'utf-8');
            let carts = JSON.parse(data);
            return carts
        }else{
            return console.log('problemas al traer los carros')
        }
       } catch (error) {
        console.log(error)
       }
    }

    //agregar nuevo carro

    save = async(cart)=>{
        try {
            let carts = await this.getAll();
            if (carts.length === 0){
                cart.id = 0;
                cart.products = [];
                carts.push(cart);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                console.log(`carrito añadido con el id ${cart.id}`);
            }else{
                cart.id = carts[carts.length-1].id+1;
                cart.products = [];
                carts.push(cart);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                console.log(`carrito añadido con el id ${cart.id}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //traer carro por id

    getById = async(id) =>{
        try{
        let carts = await this.getAll();
        let filter = carts.find((cart)=>cart.id == id);
        if(filter.id != Number(id)){
            console.log('carrito inexistente')
        }else{
            return filter
        }
        }catch(error){
            console.log(error)
        }
    }

    //borrar por id

    deleteById = async(id) =>{
        try {
            let carts = await this.getAll();
            if(carts.id != id){
                let filter = carts.filter((cart)=>cart.id != id);
                await fs.promises.writeFile(this.path, JSON.stringify(filter, null, '\t'))
            }
        } catch (error) {
            console.log(error); 
        }
    }

    //borrar producto de carrito por id

    deleteProduct = async(id, productId) =>{
        try{
            let carts = await this.getAll();
            let cart = carts.find((e)=>e.id = id);
            console.log(cart);
            try {
                let filter = cart.products.filter((e)=>e.id == productId);
                await fs.promises.writeFile(this.path, JSON.stringify(filter, null, '\t'))
            } catch (error) {
                console.log(error)
            }
        }catch(error){
            console.log(error)
        }
    }

    //añadir producto al carro

    addProductToCart = async(req) =>{
        try{
            let productId = req.params.id;
            let cartId = req.body.id

            const carrito = await this.getById(cartId);
            if(!carrito){
                console.log(`no se encontro el carrito con el id ${cartId}`);
            }
            const product = await utilidades.getById(productId);
            if(!product){
                console.log(`no se encontro producto con id ${productId}`)
            }

            let productosCart = carrito.products
            if(productosCart.includes(product)){
                console.log('este item ya se encuentra en el carrito')
            }else{
                productosCart.push(product);
                await fs.promises.writeFile(this.path, JSON.stringify(productosCart,null,'\t'))
            }
            
        }catch(error){

        }
    }

}

export default cartContext;