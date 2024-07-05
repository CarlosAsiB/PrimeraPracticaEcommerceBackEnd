import express from 'express';
import { renderChat } from '../controllers/chatController.js';

const router = express.Router();

router.get('/chat', renderChat);

export default router;
