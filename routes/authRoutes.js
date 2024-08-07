import express from 'express';
import bcrypt from 'bcryptjs';
import passport from '../config/passportconfig.js';
import User from '../dao/models/userModel.js';
import dotenv from 'dotenv';
import { sendResetPasswordEmail, resetPassword } from '../controllers/authController.js';

dotenv.config();

const router = express.Router();

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para manejar el registro
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, username, email, age, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ first_name, last_name, username, email, age, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send('Error al registrar el usuario');
  }
});

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para manejar el login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

// Ruta para autenticación con GitHub
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback para autenticación con GitHub
router.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

// Ruta para obtener el usuario actual
router.get('/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'No autenticado' });
  }
});

// Ruta para manejar el logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

// Ruta para enviar correo de restablecimiento de contraseña
router.post('/reset', sendResetPasswordEmail);

// Ruta para restablecer la contraseña
router.post('/reset/:token', resetPassword);

export default router;
