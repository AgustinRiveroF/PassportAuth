import { productModel } from "../models/product.model.js";

class ProductManager {
    async findAll(options = {}) {
        try {
            const { limit = 10, page = 1, sort, query } = options;
            const searchOptions = {};
            if (query) {
                searchOptions.category = query;
            }
            const products = await productModel
                .find(searchOptions)
                .limit(parseInt(limit))
                .skip((parseInt(page) - 1) * parseInt(limit))
                .sort(sort)
                .exec();

            return products;
        } catch (error) {
            throw error;
        }
    }

    async createOne(obj) {
        try {
            const response = await productModel.create(obj);
            return response;
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    async findOneById(productId) {
        try {
            const product = await productModel.findById(productId);
            return product;
        } catch (error) {
            throw new Error(`Error product by ID: ${error.message}`);
        }
    }

    async findAllSortedAscending(options) {
        const { limit, page, query } = options;
        const skip = (page - 1) * limit;

        const products = await productModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ product_price: 1 });

        return products;
    }

    async findAllSortedDescending(options) {
        const { limit, page, query } = options;
        const skip = (page - 1) * limit;

        const products = await productModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ product_price: -1 });

        return products;
    }

    async deleteProduct(productId) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(productId);
            return deletedProduct;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    async updateProduct(productId, updatedData) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedData, {
                new: true, // Retorna el documento modificado
                runValidators: true, // Ejecuta validadores del esquema
            });

            return updatedProduct;
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }
}

export const productManager = new ProductManager();
