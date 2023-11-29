import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
      _id: false,
    },
  ],
});


cartsSchema.methods.populateProducts = async function () {
  await this.populate("products.product").execPopulate();
};

export const cartsModel = mongoose.model("Carts", cartsSchema);

