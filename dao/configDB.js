import mongoose from "mongoose";

const URI = "mongodb+srv://agusfanzo:basededatos@cluster0.hofsaip.mongodb.net/ecommerce?retryWrites=true&w=majority"
mongoose
.connect(URI)
.then(() => console.log("Conectado a la base de datos"))
.catch((error) => console.log(error))