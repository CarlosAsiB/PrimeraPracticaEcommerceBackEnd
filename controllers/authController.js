import bcrypt from 'bcryptjs';
import passport from '../config/passportconfig.js';
import User from '../dao/models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserDTO from '../dto/UserDTO.js';

dotenv.config();

export const register = async (req, res) => {
  const { first_name, last_name, username, age, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ first_name, last_name, username, age, password: hashedPassword });
  await newUser.save();
  res.redirect('/login');
};

export const login = (req, res, next) => {
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
};

export const githubCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
  res.cookie('jwt', token, { httpOnly: true });
  res.redirect('/');
};

export const current = (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.json({ user: userDTO });
};

export const logout = (req, res) => {
  res.clearCookie('jwt');
  req.logout();
  res.redirect('/login');
};
