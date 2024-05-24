import express from 'express';
import MessageManager from '../dao/managers/MessageManager.js';

const router = express.Router();
const messageDao = new MessageManager();

// Ruta para renderizar la página de chat
router.get('/chat', async (req, res) => {
  try {
    const messages = await messageDao.getMessages();
    res.render('chat', { messages });
  } catch (error) {
    res.status(500).send('Error al recuperar los mensajes');
  }
});

export default router;
