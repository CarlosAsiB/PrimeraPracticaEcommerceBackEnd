import jwt from 'jsonwebtoken';
import User from '../dao/models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

export default async function currentUser(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Failed to authenticate token' });
  }
}
