import express from 'express';
import CartManager from '../dao/managers/CartManager.js';

const router = express.Router();
const cartDao = new CartManager();

// Rutas de la API para los carritos
router.get('/api/carts', async (req, res) => {
  try {
    const carts = await cartDao.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los carritos' });
  }
});

router.post('/api/carts', async (req, res) => {
  try {
    const newCart = await cartDao.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

router.delete('/api/carts/:id', async (req, res) => {
  try {
    await cartDao.deleteCart(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Eliminar un producto específico del carrito
router.delete('/api/carts/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartDao.removeProductFromCart(cid, pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: 'Error al eliminar el producto del carrito' });
  }
});

// Actualizar un carrito con un arreglo de productos
router.put('/api/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartDao.updateCartProducts(cid, req.body.products);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/api/carts/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await cartDao.updateProductQuantityInCart(cid, pid, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
  }
});

// Ruta para renderizar un carrito específico
router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.getCartById(cid);
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send('Error al recuperar el carrito');
  }
});

export default router;
