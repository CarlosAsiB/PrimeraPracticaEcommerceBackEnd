import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct, getProductDetails } from '../controllers/productController.js';
import { isAdmin } from '../middleware/authorization.js';

const router = express.Router();

router.get('/api/products', getProducts);
router.post('/api/products', isAdmin, addProduct);
router.put('/api/products/:id', isAdmin, updateProduct);
router.delete('/api/products/:id', isAdmin, deleteProduct);
router.get('/products/:id', getProductDetails);

export default router;
