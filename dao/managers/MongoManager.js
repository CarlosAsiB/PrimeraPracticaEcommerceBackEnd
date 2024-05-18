import CartModel from '../models/cartModel.js';
import MessageModel from '../models/messageModel.js';
import ProductModel from '../models/productModel.js';

class MongoManager {
 
  async addProduct(productData) {
    const product = new ProductModel(productData);
    await product.save();
    return product;
  }

  async getProductById(productId) {
    return await ProductModel.findById(productId);
  }

  async updateProduct(productId, productData) {
    return await ProductModel.findByIdAndUpdate(productId, productData, { new: true });
  }

  async deleteProduct(productId) {
    return await ProductModel.findByIdAndDelete(productId);
  }

  async getAllProducts() {
    return await ProductModel.find({});
  }


  async createCart() {
    const newCart = new CartModel();
    await newCart.save();
    return newCart;
  }

  async getCartById(cartId) {
    return await CartModel.findById(cartId).populate('products.product');
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await this.getCartById(cartId);
    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    cart.products = cart.products.filter(item => item.product.toString() !== productId);
    await cart.save();
    return cart;
  }

  async deleteCart(cartId) {
    return await CartModel.findByIdAndDelete(cartId);
  }


  async addMessage(messageData) {
    const message = new MessageModel(messageData);
    await message.save();
    return message;
  }

  async getAllMessages() {
    return await MessageModel.find({});
  }
}

export default MongoManager;
