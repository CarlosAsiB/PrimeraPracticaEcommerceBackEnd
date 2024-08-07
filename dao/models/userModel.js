import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: String,
  role: { type: String, default: 'user' },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
