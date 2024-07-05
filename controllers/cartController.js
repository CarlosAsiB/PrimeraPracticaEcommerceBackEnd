import CartManager from '../dao/managers/CartManager.js';
import ProductManager from '../dao/managers/ProductManager.js';
import Ticket from '../dao/models/ticketModel.js';

const cartDao = new CartManager();
const productDao = new ProductManager();

export const getCarts = async (req, res) => {
  try {
    const carts = await cartDao.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los carritos' });
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await cartDao.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
};

export const deleteCart = async (req, res) => {
  try {
    await cartDao.deleteCart(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await cartDao.getCartById(req.params.id);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.render('cartDetail', { cart });
  } catch (error) {
    res.status(500).send('Error al recuperar el carrito');
  }
};

export const updateCartProducts = async (req, res) => {
  try {
    const updatedCart = await cartDao.updateCartProducts(req.params.id, req.body.products);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
};

export const updateProductQuantityInCart = async (req, res) => {
  try {
    const updatedCart = await cartDao.updateProductQuantityInCart(req.params.id, req.params.pid, req.body.quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const updatedCart = await cartDao.removeProductFromCart(req.params.id, req.params.pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const updatedCart = await cartDao.clearCart(req.params.id);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartDao.getCartById(cartId);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    let totalAmount = 0;
    const productsOutOfStock = [];
    for (const item of cart.products) {
      const product = await productDao.getProductById(item.product._id);
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;
        await product.save();
      } else {
        productsOutOfStock.push(item.product._id);
      }
    }

    const ticket = new Ticket({
      code: generateUniqueCode(),
      amount: totalAmount,
      purchaser: req.user.email
    });

    await ticket.save();

    res.status(201).json({ ticket, productsOutOfStock });
  } catch (error) {
    res.status(500).send('Error al procesar la compra');
  }
};

function generateUniqueCode() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
