import express from 'express';
import {
  getCarts,
  createCart,
  deleteCart,
  getCartById,
  updateCartProducts,
  updateProductQuantityInCart,
  removeProductFromCart,
  clearCart,
  purchaseCart
} from '../controllers/cartController.js';

const router = express.Router();

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Retrieve a list of carts
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: A list of carts.
 */
router.get('/api/carts', getCarts);

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     responses:
 *       201:
 *         description: Cart created successfully.
 */
router.post('/api/carts', createCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   delete:
 *     summary: Delete a cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cart deleted successfully.
 */
router.delete('/api/carts/:id', deleteCart);

/**
 * @swagger
 * /carts/{id}:
 *   get:
 *     summary: Get a cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart details.
 */
router.get('/carts/:id', getCartById);

/**
 * @swagger
 * /api/carts/{id}:
 *   put:
 *     summary: Update cart products
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart updated successfully.
 */
router.put('/api/carts/:id', updateCartProducts);

/**
 * @swagger
 * /api/carts/{id}/products/{pid}:
 *   put:
 *     summary: Update product quantity in cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product quantity updated successfully.
 */
router.put('/api/carts/:id/products/:pid', updateProductQuantityInCart);

/**
 * @swagger
 * /api/carts/{id}/products/{pid}:
 *   delete:
 *     summary: Remove a product from cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from cart successfully.
 */
router.delete('/api/carts/:id/products/:pid', removeProductFromCart);

/**
 * @swagger
 * /api/carts/{id}/products:
 *   delete:
 *     summary: Clear all products from cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart cleared successfully.
 */
router.delete('/api/carts/:id/products', clearCart);

/**
 * @swagger
 * /:cid/purchase:
 *   post:
 *     summary: Purchase a cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: Cart ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart purchased successfully.
 */
router.post('/:cid/purchase', purchaseCart);

export default router;
