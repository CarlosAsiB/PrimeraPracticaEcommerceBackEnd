class ProductRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    getAllProducts(filters = {}, options = {}) {
      return this.dao.getProducts(filters, options);
    }
  
    countProducts(filters = {}) {
      return this.dao.countProducts(filters);
    }
  
    getProductById(productId) {
      return this.dao.getProductById(productId);
    }
  
    addProduct(productData) {
      return this.dao.addProduct(productData);
    }
  
    updateProduct(id, productData) {
      return this.dao.updateProduct(id, productData);
    }
  
    deleteProduct(id) {
      return this.dao.deleteProduct(id);
    }
  }
  
  export default ProductRepository;
  