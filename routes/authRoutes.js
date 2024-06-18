import express from 'express';
import bcrypt from 'bcryptjs';
import passport from '../config/passportconfig.js';
import User from '../dao/models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import currentUser from '../middleware/currentUser.js'; // Importar currentUser middleware

dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
  await newUser.save();
  res.redirect('/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie('jwt', token, { httpOnly: true });
      return res.json({ user, token });
    });
  })(req, res, next);
});

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/api/sessions/githubcallback', passport.authenticate('github', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
  res.cookie('jwt', token, { httpOnly: true });
  res.redirect('/');
});

router.get('/current', currentUser, (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  req.logout();
  res.redirect('/login');
});

export default router;
