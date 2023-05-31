import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.pluralize(null);
const collection = 'products';

const schema = new mongoose.Schema({
    id: Number,
    title: { type: String, required: true },
    price: String,
    description: { type: String, required: true },
    category: { type: String, required:true },
    image: { type: String, required: true },
    code: Number
});

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, schema);

export default productModel;