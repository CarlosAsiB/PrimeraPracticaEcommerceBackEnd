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

router.get('/carts/:id', async (req, res) => {
  try {
    const cart = await cartDao.getCartById(req.params.id);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.render('cartDetail', { cart });
  } catch (error) {
    res.status(500).send('Error al recuperar el carrito');
  }
});

// Rutas adicionales para la API del carrito
router.put('/api/carts/:id', async (req, res) => {
  try {
    const updatedCart = await cartDao.updateCartProducts(req.params.id, req.body.products);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.put('/api/carts/:id/products/:pid', async (req, res) => {
  try {
    const updatedCart = await cartDao.updateProductQuantityInCart(req.params.id, req.params.pid, req.body.quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
  }
});

router.delete('/api/carts/:id/products/:pid', async (req, res) => {
  try {
    const updatedCart = await cartDao.removeProductFromCart(req.params.id, req.params.pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
  }
});

router.delete('/api/carts/:id/products', async (req, res) => {
  try {
    const updatedCart = await cartDao.clearCart(req.params.id);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

export default router;
