import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  purchased: { type: Boolean, default: false }
});

const Cart = mongoose.model('Cart', cartSchema);

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

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getOrCreateCart();
    const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return Cart.findById(cart._id).populate('products.product'); // Ensure the product details are populated
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.getOrCreateCart();
    const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

    if (productIndex === -1) {
      throw new Error('Product not found in cart');
    }

    cart.products.splice(productIndex, 1);
    await cart.save();
    return Cart.findById(cart._id).populate('products.product'); 
  }

  async purchaseCart() {
    const cart = await this.getOrCreateCart();
    cart.purchased = true;
    await cart.save();
    return cart;
  }

  async getCart() {
    return this.getOrCreateCart();
  }
}

export default CartManager;
