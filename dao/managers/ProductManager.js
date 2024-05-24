import mongoose from 'mongoose';
import Product from '../models/productModel.js';

class ProductManager {
  async getProducts(filters = {}, options = {}) {
    return await Product.find(filters, null, options);
  }

  async addProduct(productData) {
    const product = new Product(productData);
    await product.save();
    return product;
  }

  async updateProduct(id, productData) {
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid product ID');
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async countProducts(filters = {}) {
    return await Product.countDocuments(filters);
  }
}

export default ProductManager;
