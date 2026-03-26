// src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Grains & Rice', 'Premium Rice', 'Specialty Rice'],
    default: 'Grains & Rice'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Middleware to update status based on stock
productSchema.pre('save', function() {
  if (this.stock === 0) {
    this.status = 'Out of Stock';
  } else if (this.stock < 50) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
