import express from "express";
import multer from "multer";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from 'path';


//rutas productos
import prodsRouter from "./routes/products.routes.js";

//rutas cart
import cartRouter from "./routes/cart.routes.js";

const PORT = 4000;

const app = express();

//config multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/public/img');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()} ${file.originalname}`)
    }
});

const server = app.listen(PORT, () => {
    console.log(`server on port ${PORT}`);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));
const upload = multer({ storage: storage });
//ruta para imagenes

//aqui se deben concatenar las rutas.
app.use('/static', express.static(path.join(__dirname, '/public')));

//server socket.io
const io = new Server(server);
const messages = [];
//lado del servidor
io.on('connection', (socket)=>{
    console.log('servidor Socket.io connected');
    socket.on('mensajeConexion', (user) => {
        if(user.rol === "admin"){
            socket.emit('credencialesConexion', 'Usuario valido')
        } else{
            socket.emit('credencialesConexion', 'usuario no valido')
        }
    })
    
    socket.on('message', (messageInfo) => {
        messages.push(messageInfo);
        socket.emit('message',  messages);
    })
})



//routes productos
app.use('/api/products', prodsRouter);


//routes cart
app.use('/api/carts', cartRouter);

app.get('/static', (req, res) => {

    res.render('chat', { 
        css : "style.css",
        title: "Chat"
    })
})

//este es el endpoint en el que me voy a conectar a mi aplicacion
app.post('/upload', upload.single('product'), (req, res) => {
    res.status(200).send('imagen cargada');
})

