import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../dao/models/userModel.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const router = express.Router();

// Configurar la sesión
router.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }) // Usar mongoUrl desde .env
}));

// Ruta de registro
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.redirect('/login');
});

// Ruta de login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Verificar si es el usuario administrador
  if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    req.session.userId = 'admin';
    req.session.user = { username: 'adminCoder@coder.com', role: 'admin' }; // Guardar datos del admin en la sesión
    return res.redirect('/');
  }

  // Verificar usuarios de la base de datos
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    req.session.user = { username: user.username, role: user.role }; // Guardar usuario y rol en la sesión
    return res.redirect('/');
  } else {
    return res.redirect('/login');
  }
});

// Ruta de logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('sid');
    res.redirect('/login');
  });
});

export default router;
