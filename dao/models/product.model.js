import mongoose from "mongoose"; 
import mongoosePaginate  from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true
    },
    product_description:{
        type:String,
        required:true,
    },
    product_price:{
        type:Number,
        required:true
    },
})

/* productSchema.plugin(mongoosePaginate)
 */ 
export const productModel = mongoose.model("Product", productSchema)