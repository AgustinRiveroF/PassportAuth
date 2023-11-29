import { Router } from "express";
import { cartsManager } from "../dao/managersDB/CartsManagers.js"; 
import { cartsModel } from "../dao/models/cart.models.js";
import { productModel } from "../dao/models/product.model.js";

const router = Router();

// -------------------------------------- GET ------------------------------------------


router.get("/populated/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsManager.findCartById(cid)
    
    res.render("cartsPopulated");
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:idCart", async (req, res) => {
  const { idCart } = req.params;
  const cart = await cartsManager.findCartById(idCart);
  res.json({ cart });
});

router.get('/', async (req, res) => {
  try {
    const carts = await cartsManager.getAllCarts();

    const cartsAsObjects = carts.map(cart => ({
      ...cart.toObject(),
      _id: cart._id.toString(), 
    }));

    res.render('carts', { carts: cartsAsObjects });    
  } catch (error) {
    console.error('Error getting carts:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

//------------------------------------- POST -------------------------------------------

router.post("/", async (req, res) => {
  const cart = await cartsManager.createCart();
  res.json({ cart });
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
      const { cid, pid } = req.params;

      const cart = await cartsManager.addProductToCart(cid, pid);

      res.status(200).json({ cart, message: "Product added to cart" });
  } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
  }
});


router.post('/:cid/add-product', async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId, quantity } = req.body;

    const cart = await cartsModel.findById(cid); //
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    cart.products.push({ product: product._id, quantity });
    await cart.save();

    res.status(200).json({ status: 'success', message: 'Product added to cart', cartId: cart._id });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

//------------------------------------- PUT ----------------------------------------

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid; 
  const updatedCart = req.body;

  try {
    const result = await cartsManager.updateCart(cartId, updatedCart);
    res.json({ status: "success", updatedCart: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: `Error updating cart: ${error.message}` });
  }
});


router.put("/:cid/products/:pid", async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      await cartsManager.updateProductQuantity(cid, pid, quantity);
      res.status(200).json({ status: "success", message: "Product quantity updated" });
  } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
  }
});

// ---------------------------------------- DELETE ----------------------------------- 

router.delete("/:cid", async (req, res) => {
  try {
      const { cid } = req.params;
      await cartsManager.clearCart(cid);
      res.status(200).json({ status: "success", message: "Cart cleared" });
  } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
  }
});


router.delete("/:cid/products/:pid", async (req, res) => {
  try {
      const { cid, pid } = req.params;
      await cartsManager.removeProductFromCart(cid, pid);
      res.status(200).json({ status: "success", message: "Product removed from cart" });
  } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
  }
});


export default router;