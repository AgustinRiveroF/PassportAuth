import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    email:{
        type: String,
        required: true,
        unique : true,
    },
    password:{
        type: String,
        required: true,
    },
    isGithub: {
        type: Boolean,
        default: false,
    },
    mycart:{
        type: [
            {
                productsid:{
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: 'Carts'
                }
            }
        ]
    },
    role: {
        type: String,
        default: false,
    } 
});

export const usersModel = mongoose.model('Users', usersSchema) 