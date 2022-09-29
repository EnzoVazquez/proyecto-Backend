import { Router } from "express";
import Container from "../contexts/cart.context.js";

const router = Router();
const container = new Container();

//GET "/api/carts"
router.get("/", async (req, res)=>{
    let carts = await container.getAll();
    res.send(carts);
});

//GET "/:id"
router.get("/:id", async(req,res)=>{
    let id = req.params.id;
    let cartfilter = await container.getById(id);
    if(!cartfilter){
        console.log('este carro no existe')
    }else{
        console.log(`tu carrito con id ${id} fue llamado exitosamente`)
        return cartfilter;
    }
})

//DELETE "/:id"
router.delete('/:id', async(req,res)=>{
    let id = req.params.id
    let cartDeleted = await container.deleteById(id);
})

//DELETE "/:id/products/:productId"
router.delete("/:id/pproducts/:productId", async(req,res)=>{
    let id = req.params.id
    let productId = req.params.productId;
    await container.deleteProduct(id, productId);
})
//POST
router.post('/',async(req,res)=>{
    let cart = req.body;
    await container.save(cart)
})

//POST "/:id"
router.post('/:id/products', async(req,res)=>{
    await container.addProductToCart(req);
})
export default router;
