import express from 'express';
import { upgradeToPremium } from '../controllers/userController.js';

const router = express.Router();

router.put('/premium/:uid', upgradeToPremium);

export default router;
