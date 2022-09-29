import { Router } from "express";
import context from "../contexts/productos.context.js"

const utilidades = new context();
const router = Router();

//get all products
router.get('/',async(req,res)=>{
    let stock = await utilidades.getAll();
    res.send(stock)
});

//add new product
router.post('/',async(req,res)=>{
    console.log(req.body);
    const {title, price, thumbnail} = req.body;
    if(!title||!price||!thumbnail){
        return res.status(400).send({status: "error", error: "faltan valores"});
    }

    let producto = {
        title,
        price,
        thumbnail
    };
    await utilidades.save(producto);
    res.send({status: "sucess", message: "Producto nuevo agregado"});
})

//update a product
router.put('/:id',async(req,res)=>{
    let id = Number(req.params.id);
    let {title, price, thumbnail} = JSON.stringify(req.body);
    if(!title||!price||!thumbnail){
        return res.status(400).send({status: "error", error: "faltan valores"});
    }

    let updatedProduct = {
        id,
        title,
        price,
        thumbnail
    }

    await utilidades.update(updatedProduct);
})
export default router;