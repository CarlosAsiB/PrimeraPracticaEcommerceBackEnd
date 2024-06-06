import express from 'express';
import bcrypt from 'bcryptjs';
import passport from '../config/passportconfig.js';
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

router.use(passport.initialize());
router.use(passport.session());

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

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Rutas de autenticación con GitHub
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/api/sessions/githubcallback', passport.authenticate('github', {
  failureRedirect: '/login'
}), (req, res) => {
  res.redirect('/');
});

// Ruta de logout
router.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

export default router;
