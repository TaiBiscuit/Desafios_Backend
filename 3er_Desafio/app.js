const express = require('express');

const PORT = 8080;
const server = express();
const ProductManager = require('./script')
const manager = new ProductManager('./products.json');

server.use(express.urlencoded({extended:true}));

server.get('/products', (req, res) => {
    const limit = req.query.limit;
    if(limit === undefined){
        const showProducts = manager.getProduct();
        showProducts.then(products => res.send(products));   
    } else {
        const showProducts = manager.getProduct();
        showProducts.then(products => res.send(products.slice(0,limit)));
    }
});

server.get('/products/:id?', (req, res) => {
    const productById = manager.getProductById(req.params.id)
    productById.then(products => res.send(products));  
})

server.listen(PORT, () => {
    console.log(`Server active on port ${PORT}`)
});