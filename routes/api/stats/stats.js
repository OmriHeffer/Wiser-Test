const router = require('express').Router();
const mongoose = require('mongoose');
const Store = require('../../../models/Stores');
const Product = require('../../../models/Product');

router.get('/', (req, res) => {
  const summary = {};
  const promises = [];

  promises.push(new Promise((resolve, reject) => {
    Store.find({}, (err, stores) => {
      promises.push(new Promise((resolve, reject) => {
        for (let str of stores) {
          promises.push(new Promise((resolve, reject) => {
            console.log('product pushed');
            console.log(promises);

            Product.find({'store_id': str._id}, (err, products) => {
              console.log('product found');
              console.log(str)
              summary[str._id] = {};
              summary[str._id].productCount = products.length;
              summary[str._id].name = str.name;
              
              let max = 0;
              let min = products.length === 0? 0 : Number.MAX_SAFE_INTEGER;
              let avg = 0;
    
              for (let product of products) {
                avg += product.price;
                if (product.price > max) max = product.price;
                if (product.price < min) min = product.price;
              }
    
              if (products.length > 0) {
                avg = avg / products.length;
              }
    
              summary[str._id].lowestPrice = min;
              summary[str._id].highestPrice = max;
              summary[str._id].avgPrice = avg;
  
              console.log('resolving product');
              resolve();
            });
          }));
        }
        console.log('resolving store');
        resolve();
      }));

      Promise.all(promises).then(() => {
        console.log(summary + 'Promises left: ');
        res.json(summary);
      });

      console.log('resolving all');
      resolve();
    });
  }));
});

module.exports = router;