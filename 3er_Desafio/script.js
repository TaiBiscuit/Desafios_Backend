const fs = require('fs');

class ProductManager {

    static lastId = 0;

    constructor(path) {
        this.path = path;
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        ProductManager.lastId++;
        
        const newProduct = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: ProductManager.lastId,
        }

        if(!this.products.some(product => product.code === newProduct.code )) {
            this.products.push(newProduct);
            const archiveChain = JSON.stringify(this.products);
            fs.writeFileSync(this.path, archiveChain);
        } else {
            console.log('The product already exists')
        }
    }

    getProduct = async () => {
        const products = await fs.promises.readFile(this.path, 'utf-8');
        const productJSON = JSON.parse(products);
        return productJSON;   
    }

    getProductById = async (idPassed) => {
        const products = await fs.promises.readFile(this.path, 'utf-8')
        const productJSON = JSON.parse(products);
        const checkId = productJSON.find(product => product.id == idPassed);
        if(checkId === undefined){
            return 'Not Found'
        } else {
            return checkId
        }
    }

    updateProduct = async (idPassed, field, infoToChange) =>{
        const index = this.products.findIndex(product => product.id === idPassed);
        if(index !== -1){
            this.products[index][field] = infoToChange;
        } else {
             return 'Not Found'
            }
        const archiveChain = JSON.stringify(this.products);
        await fs.promises.writeFile(this.path, archiveChain);
    }

    deleteProduct = async (idPassed) =>{
        this.products.forEach((item, index) => {
            if (item.id === idPassed) {
                this.products.splice(index, 1); 
            }
        })
        const archiveChain = JSON.stringify(this.products);
        await fs.promises.writeFile(this.path, archiveChain);
    }
}

module.exports = ProductManager;










