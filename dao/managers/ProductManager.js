import mongoose from 'mongoose';
import Product from '../models/productModel.js';

class ProductManager {
  async getProducts() {
    return await Product.find({});
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
}

export default ProductManager;
