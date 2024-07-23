import Cart from '../models/cartModel.js';

class CartManager {
  async getOrCreateCart() {
    let cart = await Cart.findOne().populate('products.product');
    if (!cart) {
      cart = new Cart({ products: [] });
      await cart.save();
      cart = await Cart.findById(cart._id).populate('products.product');
    }
    return cart;
  }

  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('products.product');
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    let cart;
    if (cartId) {
      cart = await this.getCartById(cartId);
    } else {
      cart = await this.getOrCreateCart();
    }
    const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return Cart.findById(cart._id).populate('products.product');
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

    if (productIndex === -1) {
      throw new Error('Product not found in cart');
    }

    cart.products.splice(productIndex, 1);
    await cart.save();
    return Cart.findById(cart._id).populate('products.product');
  }

  async updateCartProducts(cartId, products) {
    const cart = await this.getCartById(cartId);
    cart.products = products.map(p => ({ product: p.productId, quantity: p.quantity }));
    await cart.save();
    return Cart.findById(cart._id).populate('products.product');
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    const cart = await this.getCartById(cartId);
    const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

    if (productIndex === -1) {
      throw new Error('Product not found in cart');
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();
    return Cart.findById(cart._id).populate('products.product');
  }

  async deleteCart(cartId) {
    return await Cart.findByIdAndDelete(cartId);
  }

  async getCarts() {
    return await Cart.find().populate('products.product');
  }

  async purchaseCart(cartId) {
    const cart = await this.getCartById(cartId);
    cart.purchased = true;
    await cart.save();
    return cart;
  }
}

export default CartManager;
