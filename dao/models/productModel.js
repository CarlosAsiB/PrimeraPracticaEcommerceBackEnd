import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: { type: String, unique: true },
  stock: Number,
  owner: { type: String, default: 'admin' }
});

export default mongoose.model('Product', productSchema);
