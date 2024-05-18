import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  products: [{ product: { type: Schema.Types.ObjectId, ref: 'Product' }, quantity: { type: Number, default: 1 } }],
  purchased: { type: Boolean, default: false },
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
