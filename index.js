import express from 'express';
import { createServer } from 'http';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import MessageManager from './dao/managers/MessageManager.js';
import CartManager from './dao/managers/CartManager.js';
import ProductManager from './dao/managers/ProductManager.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const messageDao = new MessageManager();
const cartDao = new CartManager();
const productDao = new ProductManager();

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

// Usar rutas
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', chatRoutes);

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

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
