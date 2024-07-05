class CartRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    getAllCarts() {
      return this.dao.getCarts();
    }
  
    createCart() {
      return this.dao.createCart();
    }
  
    getCartById(id) {
      return this.dao.getCartById(id);
    }
  
    updateCartProducts(id, products) {
      return this.dao.updateCartProducts(id, products);
    }
  
    updateProductQuantityInCart(id, productId, quantity) {
      return this.dao.updateProductQuantityInCart(id, productId, quantity);
    }
  
    removeProductFromCart(id, productId) {
      return this.dao.removeProductFromCart(id, productId);
    }
  
    clearCart(id) {
      return this.dao.clearCart(id);
    }
  
    deleteCart(id) {
      return this.dao.deleteCart(id);
    }
  
    purchaseCart(cartId) {
      return this.dao.purchaseCart(cartId);
    }
  }
  
  export default CartRepository;
  