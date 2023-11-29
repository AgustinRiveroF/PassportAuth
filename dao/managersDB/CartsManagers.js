import { cartsModel } from "../models/cart.models.js";

class CartsManager {
  async createCart() {
    const newCart = { products: [] };
    const response = await cartsModel.create(newCart);
    return response;
  }

  async findCartById(idCart) {
    try {
      const response = await cartsModel.findById(idCart).populate('products.product');
      return response; 
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(idCart, idProduct) {
    const cart = await cartsModel.findById(idCart);

    const productIndex = cart.products.findIndex(
        (p) => p.product.equals(idProduct)
    );

    if (productIndex === -1) {
        cart.products.push({ product: idProduct, quantity: 1 });
    } else {
        cart.products[productIndex].quantity++;
    }
    return cart.save();
}


  async getAllCarts() {
    try {
      const carts = await cartsModel.find();
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        throw new Error("Cart not found");
      }

      const productIndex = cart.products.findIndex(product => product.product && product.product.toString() === productId);

      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }

      cart.products.splice(productIndex, 1);

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
  
  async updateCart(cartId, products) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      cart.products = products;

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`Error updating cart: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      const productIndex = cart.products.findIndex(product => product.product.toString() === productId);

      if (productIndex === -1) {
        throw new Error(`Product with id ${productId} not found in cart`);
      }

      cart.products[productIndex].quantity = quantity;

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`Error updating product quantity in cart: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      cart.products = [];

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }

}

export const cartsManager = new CartsManager();