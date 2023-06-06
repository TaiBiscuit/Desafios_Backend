import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';

// import FileStore from 'session-file-store';
// const FILESTORAGE = FileStore(session);

import MongoStore from 'connect-mongo';
import mainRoutes from './routes/login.routes.js';

import { __dirname } from './utils.js';
const PORT = 3000;
const PAGE_URL = `http://localhost:${PORT}`;
const LIMIT = 10;
const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('abcd1234'));

const store = MongoStore.create({mongoUrl: 'mongodb+srv://Tai:a6CF6dUQvLXPlaNk@clustertest.pmqah19.mongodb.net/coderLoginTest', mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true}, ttl: 60 });

app.use(session({
    store: store,
    secret: 'abcd1234',
    resave: false,
    saveUninitialized: false
}));


const io  = new Server(server, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    }
});


app.use('/public', express.static(`${__dirname}/public`));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);
app.use('/', mainRoutes(io, store, PAGE_URL, LIMIT))

io.on('connection', (socket) => { 
    console.log(`Cliente conectado (${socket.id})`);
    socket.emit('server_confirm', 'Conexión recibida');
    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
    });
});


try {
    await mongoose.connect('mongodb+srv://Tai:a6CF6dUQvLXPlaNk@clustertest.pmqah19.mongodb.net/coderLoginTest');

    app.listen(PORT, () => {
        console.log(`Servidor iniciado en puerto ${PORT}`);
    });
} catch(err) {
    console.log(err.message);
}