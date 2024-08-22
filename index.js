import express from 'express';
import { createServer } from 'http';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';
import cookieParser from 'cookie-parser'; 
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import swaggerRouter from './config/swagger.js';
import productRoutes from './routes/productRoutes.js';
import productViewRoutes from './routes/productViewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import requireAuth from './middleware/requireAuth.js';
import MessageManager from './dao/managers/MessageManager.js';
import CartManager from './dao/managers/CartManager.js';
import ProductManager from './dao/managers/ProductManager.js';
import passport from './config/passportconfig.js';
import logger from './config/logger.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const messageDao = new MessageManager();
const cartDao = new CartManager();
const productDao = new ProductManager();

const PORT = process.env.PORT || 8080;

// Conexión a MongoDB
logger.info('Conectando a MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
})
.then(() => logger.info('MongoDB conectado'))
.catch(err => logger.error('Error de conexión a MongoDB:', err));

// Configurar Handlebars como motor de vistas
app.engine('handlebars', engine({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware para analizar JSON y servir archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());

// Configurar la sesión
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

app.use(flash());

// Configurar Passport
app.use(passport.initialize());
app.use(passport.session());

// Usar rutas de autenticación
app.use(authRoutes);

// Usar rutas protegidas con el middleware de autenticación
app.use('/', requireAuth, productViewRoutes);
app.use('/api', requireAuth, productRoutes);
app.use('/', requireAuth, cartRoutes);
app.use('/', requireAuth, chatRoutes);

// Usar rutas de Swagger
app.use(swaggerRouter);

// Configuración de la conexión Socket.io
io.on('connection', async (socket) => {
  logger.info('Un usuario se ha conectado:', socket.id);

  // Emitir los productos existentes al nuevo cliente
  socket.emit('productUpdated', await productDao.getProducts());

  // Emitir los mensajes existentes al nuevo cliente
  socket.emit('loadMessages', await messageDao.getMessages());

  socket.on('newProduct', async (product) => {
    try {
      const newProduct = await productDao.addProduct(product);
      io.emit('productAdded', newProduct);
    } catch (error) {
      logger.error('Error al agregar un nuevo producto:', error);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      const stringId = String(productId).trim();
      logger.info(`Intentando eliminar el producto con ID: ${stringId}`);
      await productDao.deleteProduct(stringId);
      const allProducts = await productDao.getProducts();
      io.emit('productUpdated', allProducts);
    } catch (error) {
      logger.error('Error al eliminar el producto:', error);
    }
  });

  // Escuchar nuevos mensajes de chat
  socket.on('newMessage', async (messageData) => {
    try {
      const newMessage = await messageDao.addMessage(messageData);
      io.emit('messageAdded', newMessage);
    } catch (error) {
      logger.error('Error al agregar un nuevo mensaje:', error);
    }
  });

  // Agregar producto al carrito
  socket.on('addToCart', async ({ productId, quantity }) => {
    try {
      const trimmedProductId = productId.trim();
      const updatedCart = await cartDao.addProductToCart(null, trimmedProductId, quantity);
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      logger.error('Error al agregar el producto al carrito:', error);
    }
  });

  // Comprar carrito
  socket.on('buyCart', async () => {
    try {
      const updatedCart = await cartDao.purchaseCart();
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      logger.error('Error al comprar el carrito:', error);
    }
  });

  // Eliminar producto del carrito
  socket.on('removeFromCart', async (productId) => {
    try {
      const trimmedProductId = productId.trim();
      const updatedCart = await cartDao.removeProductFromCart(null, trimmedProductId);
      io.emit('cartUpdated', updatedCart);
    } catch (error) {
      logger.error('Error al eliminar el producto del carrito:', error);
    }
  });
});

// Endpoint para probar los diferentes niveles de log
app.get('/loggerTest', (req, res) => {
  logger.debug('Debug log');
  logger.http('HTTP log');
  logger.info('Info log');
  logger.warn('Warning log');
  logger.error('Error log');
  logger.log('fatal', 'Fatal log'); 
  res.send('Logger test endpoint');
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  logger.info(`Servidor en ejecución en http://localhost:${PORT}`);
});

export default app;  // Exporta app para las pruebas
