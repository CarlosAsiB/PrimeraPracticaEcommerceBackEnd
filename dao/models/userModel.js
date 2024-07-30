import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },  
  age: { type: Number, required: true },
  password: { type: String, required: true },
  githubId: { type: String },
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

export default User;

