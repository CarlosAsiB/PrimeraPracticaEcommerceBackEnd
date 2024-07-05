import express from 'express';
import { getHomePage, getRealTimeProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getHomePage);
router.get('/realtimeproducts', getRealTimeProducts);

export default router;
