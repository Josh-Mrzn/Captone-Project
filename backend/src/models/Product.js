import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Number, // Storing the integer userId
    required: true,
  },
});

productSchema.pre('save', async function() {
  this.updatedAt = Date.now();
  // ✅ No next() call needed because the function is async
});

const Product = mongoose.model('Product', productSchema);

export default Product;
