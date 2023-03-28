class ProductManager {

    static lastId = 0;

    constructor() {
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
        } else {
            console.log('The product already exists')
        }


    }

    getProduct() {
        console.log(this.products);
    }

    getProductById(idPassed) {
        const checkId = this.products.find(product => product.id === idPassed);
        if(checkId === undefined){
            console.log("Not found")
        }
        console.log(checkId)
    }
}


