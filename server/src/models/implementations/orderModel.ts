import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  razorpayOrderId: {type:String},
  razorpayPaymentId: {type:String},
  razorpaySignature: {type:String},
  amount: {type:Number},
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
