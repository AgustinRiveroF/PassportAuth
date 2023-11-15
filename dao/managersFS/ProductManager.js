import { readFileSync, writeFileSync } from "fs";

class ProductManager {
    constructor() {
        this.products = [];
        this.comision = 0.15;
        this.path = './products.json';
        this.loadFromFile();
    }

    getNextID = () => {
        const count = this.products.length;
        const nextID = count > 0 ? this.products[count - 1].id + 1 : 1;
        return nextID;
    }

    getNextCode = () => {
        const count = this.products.length;
        const nextCode = count > 0 ? this.products[count - 1].id + 1 : 1;
        return nextCode;
    }

    loadFromFile() {
        try {
            const data = readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    saveToFile() {
        const data = JSON.stringify(this.products, null, 2);
        writeFileSync(this.path, data, 'utf8');
    }

    addProduct(title, description, price, thumbnail, code, stock, category) {
        if (!title || !description || !price || !code || !stock){
            throw new Error('Todos los campos son obligatorios.');
        }

        if (this.products.some(product => product.code === code)) {
            throw new Error(`Ya existe un producto con el código ${code}. El producto ${description} no será agregado.`);
        }

        const productosAgregados = {
            id: this.getNextID(),
            title,
            description,
            price: (parseFloat(price) + (parseFloat(price) * this.comision)).toFixed(2),
            thumbnail,
            code,
            stock,
            status: true,
            category,
        };

        this.products.push(productosAgregados);

        this.saveToFile();
    }

    getProducts = () => this.products;

    getProductById = (id) => {
    
        const productId = parseInt(id);
      
        const product = this.products.find((product) => product.id === productId);
      
        if (!product) {
          console.log(`Producto no encontrado por ID ${productId}`);
          return null;
        }
      
        return product;
      }
      

      updateProduct(id, updatedData) {
        const products = this.getProducts();
        const productId = parseInt(id);
        
        const productIndex = products.findIndex(prod => prod.id === productId);
        
        if (productIndex === -1) {
            throw new Error(`Producto con ID ${id} no encontrado en la actualización`);
        }
        
        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedData,
        };
        
        this.saveToFile();
        
        return true;
    }
    

    deleteProduct(id) {
        const products = this.getProducts();
        const productId = parseInt(id);
    
        const nuevoArray = products.filter(prod => prod.id !== productId);
    
        if (nuevoArray.length === products.length) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
    
        this.products = nuevoArray;
        this.saveToFile();
    
        return true;
    }
    
}

const productManager = new ProductManager();
export default productManager;

