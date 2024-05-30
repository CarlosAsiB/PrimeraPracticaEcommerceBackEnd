import express from 'express';
import ProductManager from '../dao/managers/ProductManager.js';

const router = express.Router();
const productDao = new ProductManager();

// Ruta principal que renderiza la plantilla de inicio con los productos
router.get('/', async (req, res) => {
  try {
    console.log('Usuario logueado:', req.session.user); // Mensaje de depuración
    const products = await productDao.getProducts();
    console.log('Productos recuperados para la página de inicio:', products);
    res.render('home', { products, user: req.session.user }); // Pasar datos del usuario a la vista
  } catch (error) {
    console.error('Error al recuperar los productos:', error);
    res.status(500).send('Error al recuperar los productos');
  }
});

// Vista en tiempo real de los productos
router.get('/realtimeproducts', async (req, res) => {
  try {
    console.log('Usuario logueado:', req.session.user); // Mensaje de depuración
    const products = await productDao.getProducts();
    console.log('Productos recuperados para la vista en tiempo real:', products);
    res.render('realTimeProducts', { products, user: req.session.user }); // Pasar datos del usuario a la vista
  } catch (error) {
    console.error('Error al recuperar los productos:', error);
    res.status(500).send('Error al recuperar los productos');
  }
});

// Ruta para obtener los detalles de un producto específico
router.get('/products/:id', async (req, res) => {
  try {
    console.log('Usuario logueado:', req.session.user); // Mensaje de depuración
    const product = await productDao.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.render('productDetail', { product, user: req.session.user }); // Pasar datos del usuario a la vista
  } catch (error) {
    console.error('Error al recuperar el producto:', error);
    res.status(500).send('Error al recuperar el producto');
  }
});

export default router;
