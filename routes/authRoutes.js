import express from 'express';
import { register, login, githubCallback, current, logout } from '../controllers/authController.js';
import passport from '../config/passportconfig.js';
import currentUser from '../middleware/currentUser.js';

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', register);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', login);

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/api/sessions/githubcallback', passport.authenticate('github', { session: false }), githubCallback);

router.get('/current', currentUser, current);

router.post('/logout', logout);

export default router;
