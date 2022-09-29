import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import views from './routes/views.router.js';
import productosRouter from './routes/productos.router.js'
import cartRouter from './routes/cart.router.js'
import contenedor from './contexts/productos.context.js';
import { Server } from 'socket.io';
import chatContext from './contexts/chat.context.js';


const utilidades = new contenedor();
const utilidadesChat = new chatContext();

const app = express();

const server = app.listen(8080,()=>console.log('conectado al puerto 8080'));


const io = new Server(server)
//seteo del motor de vistas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine','handlebars');
//lectura de archivos json
app.use(express.json());
//lectura de archivos estaticos
app.use(express.static(__dirname +'/public'));
app.use(express.urlencoded({ extended: true }))
//vistas
app.use('/',views);
app.use('/api/productos', productosRouter);
app.use('/api/carrito', cartRouter)
//socket
io.on("connection", async(socket)=>{
    console.log("socket conectado");
    let productos = await utilidades.getAll();
    let chat = await utilidadesChat.getUsers();
    io.emit("updatedProductList", productos);
    io.emit("chatMessages", chat);

    //socket chat
    socket.on("message", async(data)=>{
        await utilidadesChat.save(data);
        let chat = await utilidadesChat.getUsers();
        io.emit("chatMessage", chat)
    })

    //socket productos
    socket.on("newProduct", async(data)=>{
        await utilidades.save(data);
        let stock = await utilidades.getAll();
        io.emit("updateProductList", stock)
    })
})
