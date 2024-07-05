import express from 'express';
import { getCarts, createCart, deleteCart, getCartById, updateCartProducts, updateProductQuantityInCart, removeProductFromCart, clearCart, purchaseCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/api/carts', getCarts);
router.post('/api/carts', createCart);
router.delete('/api/carts/:id', deleteCart);
router.get('/carts/:id', getCartById);
router.put('/api/carts/:id', updateCartProducts);
router.put('/api/carts/:id/products/:pid', updateProductQuantityInCart);
router.delete('/api/carts/:id/products/:pid', removeProductFromCart);
router.delete('/api/carts/:id/products', clearCart);
router.post('/:cid/purchase', purchaseCart);

export default router;
