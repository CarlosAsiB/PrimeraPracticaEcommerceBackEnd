import express from 'express';
import { createServer } from 'http';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductManager from './dao/managers/ProductManager.js';
import CartManager from './dao/managers/CartManager.js';
import MessageManager from './dao/managers/MessageManager.js';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';

// Cargar variables de entorno
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const productDao = new ProductManager();
const cartDao = new CartManager();
const messageDao = new MessageManager();

const PORT = process.env.PORT || 8080;

// Conexión a MongoDB
console.log('Conectando a MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log('Error de conexión a MongoDB:', err));

// Configurar Handlebars como motor de vistas

app.engine('handlebars', engine({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware para analizar JSON y servir archivos estáticos
app.use(express.json());
app.use(express.static('public'));

// Ruta principal que renderiza la plantilla de inicio con los productos
app.get('/', async (req, res) => {
  try {
    const products = await productDao.getProducts();
    console.log('Productos recuperados para la página de inicio:', products);
    res.render('home', { products });
  } catch (error) {
    console.error('Error al recuperar los productos:', error);
    res.status(500).send('Error al recuperar los productos');
  }
});

// Vista en tiempo real de los productos
app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productDao.getProducts();
    console.log('Productos recuperados para la vista en tiempo real:', products);
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al recuperar los productos:', error);
    res.status(500).send('Error al recuperar los productos');
  }
});

// Ruta para renderizar la página de chat
app.get('/chat', async (req, res) => {
  try {
    const messages = await messageDao.getMessages();
    res.render('chat', { messages });
  } catch (error) {
    res.status(500).send('Error al recuperar los mensajes');
  }
});

// Configuración de la conexión Socket.io
io.on('connection', async (socket) => {
  console.log('Un usuario se ha conectado:', socket.id);

  // Emitir los productos existentes al nuevo cliente
  socket.emit('productUpdated', await productDao.getProducts());

  // Emitir los mensajes existentes al nuevo cliente
  socket.emit('loadMessages', await messageDao.getMessages());

  socket.on('newProduct', async (product) => {
    try {
      const newProduct = await productDao.addProduct(product);
      io.emit('productAdded', newProduct);
    } catch (error) {
      console.log('Error al agregar un nuevo producto:', error);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      const stringId = String(productId).trim();
      console.log(`Intentando eliminar el producto con ID: ${stringId}`);
      await productDao.deleteProduct(stringId);
      const allProducts = await productDao.getProducts();
      io.emit('productUpdated', allProducts);
    } catch (error) {
      console.log('Error al eliminar el producto:', error);
    }
  });

  // Escuchar nuevos mensajes de chat
  socket.on('newMessage', async (messageData) => {
    try {
      const newMessage = await messageDao.addMessage(messageData);
      io.emit('messageAdded', newMessage);
    } catch (error) {
      console.log('Error al agregar un nuevo mensaje:', error);
    }
  });

  // Agregar producto al carrito
  socket.on('addToCart', async ({ productId, quantity }) => {
    try {
      const trimmedProductId = productId.trim();
      const updatedCart = await cartDao.addProductToCart(null, trimmedProductId, quantity);
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      console.log('Error al agregar el producto al carrito:', error);
    }
  });

  // Comprar carrito
  socket.on('buyCart', async () => {
    try {
      const updatedCart = await cartDao.purchaseCart();
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      console.log('Error al comprar el carrito:', error);
    }
  });

  // Eliminar producto del carrito
  socket.on('removeFromCart', async (productId) => {
    try {
      const trimmedProductId = productId.trim();
      const updatedCart = await cartDao.removeProductFromCart(null, trimmedProductId);
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      console.log('Error al eliminar el producto del carrito:', error);
    }
  });
});

// Rutas de la API para los productos
app.post('/api/products', async (req, res) => {
  try {
    const product = await productDao.addProduct(req.body);
    io.emit('productAdded', product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await productDao.updateProduct(req.params.id, req.body);
    io.emit('productUpdated', await productDao.getProducts());
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await productDao.deleteProduct(req.params.id);
    const allProducts = await productDao.getProducts();
    io.emit('productUpdated', allProducts);
    res.status(204).end();
  } catch (error) {
    io.emit('deleteError', { error: error.message, id: req.params.id });
    res.status(404).json({ error: error.message });
  }
});

// Rutas de la API para los carritos
app.get('/api/carts', async (req, res) => {
  try {
    const carts = await cartDao.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los carritos' });
  }
});

app.post('/api/carts', async (req, res) => {
  try {
    const newCart = await cartDao.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

app.delete('/api/carts/:id', async (req, res) => {
  try {
    await cartDao.deleteCart(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
