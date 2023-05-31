import {} from 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import FileStore from 'session-file-store';
import mainRoutes from './routes/login.routes.js';
const FILESTORAGE = FileStore(session);

import userRouter from './api/users/users.routes.js';

import { __dirname } from './utils.js';
const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = 'mongodb://127.0.0.1:27017/coderTest';
const COOKIE_SECRET = 'abcd1234';
const PAGE_URL = `http://localhost:${PORT}`;
const LIMIT = 10;
const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));

const fileStore = new FILESTORAGE({path: `${__dirname}/sessions`, ttl:3000, retries:0});

app.use(session({
    store: fileStore,
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));

const store = {}

const io  = new Server(server, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    }
});


app.use('/api', userRouter);
app.use('/public', express.static(`${__dirname}/public`));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);
app.use('/', mainRoutes(io, store, PAGE_URL, LIMIT))

io.on('connection', sock => {
    console.log('New connection started');
    sock.emit('server_confirm', 'Conexión recibida');
    
    sock.on('new_product_in_cart', (data) => {;
        io.emit('product_added_to_cart', data);
    });
    
    sock.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
    });
});

try {
    await mongoose.connect("mongodb://127.0.0.1:27017/coderTest");

    app.listen(PORT, () => {
        console.log(`Servidor iniciado en puerto ${PORT}`);
    });
} catch(err) {
    console.log(err.message);
}