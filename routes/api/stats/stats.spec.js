process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../bin/www');
let should = chai.should();
const expect = chai.expect;
const Product = require('../../../models/Product');
const Store = require('../../../models/Stores');

chai.use(chaiHttp);

describe('Stats', () => {
  let store1ID;
  let store2ID;

  // Set 3 products and 2 stores.
  beforeEach((done) => {
    Product.remove({}, (err) => { 
      Store.remove({}, (err) => {
        const prod1 = new Product();
        prod1.price = 100;
        prod1.shipping = 10;
        prod1.sku = "test1";
        prod1.title = "Amazing";
        prod1.brand = "Smithy";
        prod1.store_id = "123";
  
        const prod2 = new Product();
        prod2.price = 1000;
        prod2.shipping = 10;
        prod2.sku = "test2";
        prod2.title = "Even better!";
        prod2.brand = "Dwarf Industries";
        prod2.store_id = "123";
  
        const prod3 = new Product();
        prod3.price = 500;
        prod3.shipping = 10;
        prod3.sku = "test3";
        prod3.title = "Much better!";
        prod3.brand = "Elf Industries";
        prod3.store_id = "234";
  
        const store1 = new Store();
        store1.name="A";
        store1.url="lol";
  
        const store2 = new Store();
        store2.name = 'B';
        store2.url = 'lol';
  
        store1.save((err, str1) => {
          store1ID = str1._id;
          prod1.store_id = str1._id;
          prod2.store_id = str1._id;
  
          prod1.save((err, prd1) => {
            prod2.save((err, prd2) => {
              store2.save((err, str2) => {
                store2ID = str2._id;
                prod3.store_id = str2._id;
                prod3.save((err, prd3) => {
                  done();
                });
              });
            });
          });
        });
      })
    });
  });

  it('Should correctly summerize store A', (done) => {
    chai.request(server)
        .get('/stats')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body[store1ID].should.have.property('productCount').eql(2);
          res.body[store1ID].should.have.property('lowestPrice').eql(100);
          res.body[store1ID].should.have.property('highestPrice').eql(1000);
          res.body[store1ID].should.have.property('avgPrice').eql(550);
          done();
    });
  });

  it ('Should correctly summerize store B', (done) => {
    chai.request(server)
        .get('/stats')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body[store2ID].should.have.property('productCount').eql(1);
          res.body[store2ID].should.have.property('lowestPrice').eql(500);
          res.body[store2ID].should.have.property('highestPrice').eql(500);
          res.body[store2ID].should.have.property('avgPrice').eql(500);
          done();
    });
  });
});