import { productManager } from "../dao/managersDB/product.managers.js";
import { Router } from "express";

const router = Router();

router.post("/admin/add-product", async (req, res) => {
    try {
        const { product_name, product_price, product_description } = req.body;

        if (!product_name || !product_price || !product_description) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newProduct = await productManager.createOne({
            product_name,
            product_price,
            product_description,
        });

        return res.render("admin", { Message: 'Producto Agregado', newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno al agregar producto" });
    }
});

router.put("/update-product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const { newProductName, newProductPrice, newProductDescription } = req.body;

        // Validación de ID
        if (!productId || !newProductName) {
            return res.status(400).json({ message: "Se requiere un ID de producto y un nuevo nombre" });
        }

        const updatedProduct = await productManager.updateProduct(productId, {
            product_name: newProductName,
            product_price: newProductPrice,
            product_description: newProductDescription,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto actualizado exitosamente", product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno al actualizar producto" });
    }
});



router.post("/update-product", async (req, res) => {
    try {
        const { productId, productIdToUpdate, newProductName, newProductPrice, newProductDescription } = req.body;

        // Validación de ID
        if (!productIdToUpdate || !newProductName) {
            return res.status(400).json({ message: "Se requiere un ID de producto a actualizar y un nuevo nombre" });
        }

        const updatedProduct = await productManager.updateProduct(productIdToUpdate, {
            product_name: newProductName,
            product_price: newProductPrice,
            product_description: newProductDescription,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto actualizado exitosamente", product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno al actualizar producto" });
    }
});


router.post("/delete-product", async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Se requiere un ID de producto válido" });
        }

        const deletedProduct = await productManager.deleteProduct(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto eliminado exitosamente", product: deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno al eliminar producto" });
    }
});

export default router;
