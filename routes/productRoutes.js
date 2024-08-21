import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct, getProductDetails } from '../controllers/productController.js';
import { getMockProducts } from '../controllers/mockingController.js';
import { isAdmin } from '../middleware/authorization.js';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products.
 */
router.get('/api/products', getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     responses:
 *       201:
 *         description: Product created successfully.
 */
router.post('/api/products', isAdmin, addProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated successfully.
 */
router.put('/api/products/:id', isAdmin, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted successfully.
 */
router.delete('/api/products/:id', isAdmin, deleteProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details.
 */
router.get('/products/:id', getProductDetails);

/**
 * @swagger
 * /mockingproducts:
 *   get:
 *     summary: Retrieve a list of mock products
 *     tags: [Mocking]
 *     responses:
 *       200:
 *         description: A list of mock products.
 */
router.get('/mockingproducts', getMockProducts);

export default router;
