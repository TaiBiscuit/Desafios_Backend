import mongoose from 'mongoose';
import productModel from './product.model.js';

class ProductManager {
    
    constructor () {
        this.status = 1
    }

    getProducts = async (offset, limit, ) => {
        try {
            const queryOptions = {
                offset: offset,
                limit: limit,
                lean: true,
            };
            const products = await productModel.paginate({}, queryOptions)
            return products
        } catch (err) {
            this.status = -1;
            console.log(err)
        }
    }

    getProductsById = async (productId) => {
        try {
            const products = await productModel.findById(productId);
            return products
        }catch (err) {
            this.status = -1;
            console.log(err)
        }
    }
}

export default ProductManager;