const router = require('express').Router();
const mongoose = require('mongoose');
const Product = require('../../../models/Product');

router.get('/', (req, res) => {
  //filters
  const price = req.query.price;
  const shipping = req.query.shipping;
  const sku = req.query.sku;
  const title = req.query.title;
  const brand = req.query.brand;
  const store_id = req.query.store_id;

  const sortby = req.query.sortby;
  const sortOrder = req.query.sort;
  let limit = req.query.limit;
  
  const filter = {};

  if (price) filter.price = +price;
  if (shipping) filter.shipping = +shipping;
  if (sku) filter.sku = sku;
  if (title) filter.title = title;
  if (brand) filter.brand = brand;
  if (store_id) filter.store_id = store_id;

  let q = Product.find(filter);

  if (sortby) {
    let sortQuery = {};
    sortQuery[sortby] = 1;

    q = q.sort(sortQuery);
  }
  
  if (limit) {
    limit = +limit;
    q = q.limit(limit);
  }

  q.exec((err, products) => {
    if (err) return console.error(err);
    res.json(products);
  });
});

module.exports = router;