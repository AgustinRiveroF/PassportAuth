import { Router } from "express";
import { productManager } from "../dao/managersDB/product.managers.js";
import { usersManager } from "../dao/managersDB/usersManager.js";

const router = Router();

router.get("/", async (req, res) => {

    try {
        if (!req.session.user) {
            return res.redirect("/views/login");
        }
        const userRole = req.session.user.email === "adminCoder@coder.com" ? "admin" : "usuario";

        const { limit = 12, page = 1, sort, query } = req.query || {};
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        };

        let products;

        if (sort === "asc") {
            products = await productManager.findAllSortedAscending(options);
        } else if (sort === "desc") {
            products = await productManager.findAllSortedDescending(options);
        } else {
            products = await productManager.findAll(options);
        }

        const totalProducts = products.length;
        const totalPages = totalProducts > 0 ? Math.ceil(totalProducts / limit) : 1;
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}` : null;
        const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}` : null;

        const { first_name, last_name, email } = req.session.user || {};
        const userData = {
            first_name,
            last_name,
            email
        };

        res.render('products', {
            user: userData,
            role: userRole,
            products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.findOneById(pid);

        if (!product) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }

        res.render("productDetails", { product: product.toObject() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// POST
router.post("/", async (req, res) => {
    try {
        const { first_name, last_name, email } = req.session.user || {};

        const { product_name, product_price, product_description } = req.body;

        const createProduct = await productManager.createOne({
            product_name,
            product_price,
            product_description,
            createdBy: { first_name, last_name, email }
        });

        return res.render("admin", { Message: 'Producto Agregado' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        const deletedProduct = await productManager.deleteProduct(productId);

        if (!deletedProduct) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }

        res.status(200).json({ status: "success", message: "Product deleted", deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});


export default router;
