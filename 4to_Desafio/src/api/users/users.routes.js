import { Router } from "express";
import userModel from './users.model.js'

const userRouter = Router();

userRouter.get('/users', async (req, res) => {
    try {
        const process = await userModel.find();
        res.status(200).send({ status: 'OK', data: process });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
});

userRouter.get('/setCookie', async (req, res) => {
    try {
        res.cookie('cookie1', 'Contenido de la Cookie!',{maxAge: 6000});
        res.status(200).send({ status: 'OK', data: "Hay cookie!" });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
})

userRouter.get('/getCookie', async (req, res) => {
    try{
        res.status(200).send({ status: 'OK', data: req.cookies });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
})

userRouter.get('/deleteCookie', async (req, res) => {
    try {
        res.clearCookie('cookie1');
        res.status(200).send({ status: 'OK', data: 'Cookie deleted!' });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
})


//Uso de Cookies seguras

userRouter.get('/setSignedCookie', async (req, res) => {
    try {
        res.cookie('cookie2', 'Cookie segura', { maxAge:6000, signed: true });
        res.status(200).send({ status: 'OK', data: 'Cookie segura seteada' })
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
})



// USO DE EXPRESS SESSION

userRouter.get('/login', async (req, res) => {
    try {
        if(req.session.counter) {
            req.session.counter++
            res.send({ status: 'OK', data: `Se visito ${req.session.counter}` });
        } else {
            req.session.counter = 1;
            res.send({ status: 'OK', data: `BENVENUTI` })
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
})

userRouter.get('/logout', async (req, res) => {
    try {  
        req.session.destroy((err) => {
            if(!err) {
                res.status(200).send({ status: 'OK', data: 'User logged out!' });
            } else {
                res.status(500).send({ status: 'ERR', error: err.message });         
            }
        });

    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
})

export default userRouter;