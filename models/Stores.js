const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: String
})

const StoreModel = mongoose.model('Store', StoreSchema);
module.exports = StoreModel;