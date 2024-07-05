import MessageManager from '../dao/managers/MessageManager.js';

const messageDao = new MessageManager();

export const renderChat = async (req, res) => {
  try {
    const messages = await messageDao.getMessages();
    res.render('chat', { messages });
  } catch (error) {
    res.status(500).send('Error al recuperar los mensajes');
  }
};
