const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    category: {
        type: [String],
        enum:['CasualWear','EthnicWear','OfficeWear','WesternWear'],
         required: true },
         Gender:{
            type:[String],
            enum:['Female','Male','Kids'],
         },
    imageUrl: {type: String, required: true},
    variants: [{
        color: {
            type: String,
            enum: ['red', 'blue', 'green', 'yellow', 'purple', 'white', 'black'],
            required: true
        },
        size: {
            type: String,
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            required: true
        },
        stock: {
            type: Number,
            default: 0
        }
    }],
   isFeatured:{
    type:Boolean,
    default:false
   },
   seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},{timestamps:true},
);

module.exports = mongoose.model('Product',productSchema);

