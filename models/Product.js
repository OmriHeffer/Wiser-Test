const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  store_id: {
    type: String,
    required: true
  }
})

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;