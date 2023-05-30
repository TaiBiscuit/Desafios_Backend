import {} from 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import userRouter from './api/users/users.routes.js';

import { __dirname } from './utils.js';
const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;
const COOKIE_SECRET = 'abcd1234';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
app.use(session({
    secret: COOKIE_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use('/api', userRouter);
app.use('/public', express.static(`${__dirname}/public`));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);


try {
    await mongoose.connect("mongodb://127.0.0.1:27017/coderTest");

    app.listen(PORT, () => {
        console.log(`Servidor iniciado en puerto ${PORT}`);
    });
} catch(err) {
    console.log(err.message);
}