import express from 'express'
import ProductManager from '../api/products/ProductManager.js';
import UserManager from '../api/users/UserManager.js';
import { generateToken, authToken } from "../auth/jwt.config.js";
import { Router } from 'express';

const userManager = new UserManager();
const manager = new ProductManager();

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

        let limit = req.query.limit;      
        if(limit === undefined) limit = LIMIT;
        if(req.query.page === undefined) req.query.page = 0;
        const result = await manager.getProducts(req.query.page * limit, limit);
        const pages = [];
        for(let i = 0; i < result.totalPages; i++) {
            pages.push({index: i, indexPgBar: i+1});
        }

        const pagination = {
            pageUrl: PAGE_URL,
            limit: limit,
            offset: result.offset,
            totalPages: result.totalPages,
            totalDocs: result.totalDocs,
            page: result.page -1,
            nextPageUrl: `/login?page=${result.nextPage -1}`,
            prevPageUrl: `/login?page=${result.prevPage -1}`,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            pagesArray: pages
        }
        if(login_email == 'adminCoder@coder.com' && login_password == 'adminCod3r123') {
            res.render('products', {products: result.docs, pagination: pagination, userAcc: 'admin', userName: login_email});
        } else {
            const user = await userManager.validateUser(login_email, login_password);
            if(user === null) {
                req.session.userValidated = false;
                req.session.errorMessage = 'Wrong User or Password';
                res.render('login');
            } else {
                req.session.userValidated = true;
                res.render('products', {products: result.docs, pagination: pagination, userAcc: 'user', userName: login_email});
            }
        }
    });

    loginRouter.get('/register', async (req, res) => {
        const {login_email, login_password, first_name, last_name} = req.body;
        console.log(login_email, login_password, first_name, last_name)
        res.render('register');
    });
 
    loginRouter.post('/submit', async (req, res) => {
        const {userName, password, firstName, lastName} = req.body;
        const user = {
            firstName,
            lastName,
            userName,
            password
        }
        const process = userManager.addUser(user)
        res.render('login')
    });

    loginRouter.get('/logout', async (req, res) => {
        req.session.userValidated = req.sessionStore.userValidated = false,
        req.session.destroy()
        res.redirect('/');
    });


    //TOKEN

    loginRouter.get('/tokenonly', async (req, res) => {

    })

    return loginRouter
}



export default mainRoutes;