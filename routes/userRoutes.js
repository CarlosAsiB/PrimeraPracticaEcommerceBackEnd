import express from 'express';
import User from '../dao/models/userModel.js';
import nodemailer from 'nodemailer';
import moment from 'moment';
import { isAdmin } from '../middleware/authorization.js';  // Middleware para verificar si es administrador

const router = express.Router();

// Ruta GET para obtener todos los usuarios con datos principales
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'first_name last_name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Ruta DELETE para eliminar usuarios inactivos
router.delete('/', async (req, res) => {
  try {
    const twoDaysAgo = moment().subtract(2, 'days').toDate();
    const usersToDelete = await User.find({ lastLogin: { $lt: twoDaysAgo } });

    // Enviar correos y eliminar usuarios
    usersToDelete.forEach(async (user) => {
      await sendDeletionEmail(user.email);
      await User.deleteOne({ _id: user._id });
    });

    res.json({ message: 'Usuarios inactivos eliminados y correos enviados.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuarios' });
  }
});

// Función para enviar correos de eliminación
async function sendDeletionEmail(email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Cuenta eliminada por inactividad',
    text: 'Tu cuenta ha sido eliminada debido a la inactividad de los últimos 2 días.',
  };

  await transporter.sendMail(mailOptions);
}

// Ruta para el administrador ver y gestionar usuarios
router.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.render('adminUsers', { users });
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar la vista de usuarios' });
  }
});
router.get('/admin/users', isAdmin, async (req, res) => {
    try {
      const users = await User.find({});
      res.render('adminUsers', { users });
    } catch (err) {
      res.status(500).json({ error: 'Error al cargar la vista de usuarios' });
    }
  });

export default router;
