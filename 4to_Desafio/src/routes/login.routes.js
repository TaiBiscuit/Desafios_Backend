import express from 'express'
import ProductManager from '../api/products/ProductManager.js';
import UserManager from '../api/users/UserManager.js';
import { Router } from 'express';

const userManager = new UserManager();
const productManager = new ProductManager();

const loginRouter = Router();

const mainRoutes = (io, store, PAGE_URL, LIMIT) => {
    loginRouter.get('/',async (req, res) => {
        if(req.session.userValidated) {

        } else {
            res.render('login', {
                sessionInfo: req.session
            });
        }
    });
    
    loginRouter.post('/login', async (req, res) => {
        const {login_email, login_password} = req.body;
        const user = await userManager.validateUser(login_email, login_password);
        console.log(user)
        // Para datos no validos
        if(user === null) {
            req.session.userValidated = false;
            req.session.errorMessage = 'Wrong User or Password';
            res.status(200).send({status: 'Not ok'})
        } else {
            res.status(200).send({status: 'ok'})
        }
        res.redirect(PAGE_URL);
    });

    return loginRouter
}



export default mainRoutes;