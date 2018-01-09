process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../bin/www');
let should = chai.should();
const expect = chai.expect;
const Product = require('../../../models/Product');

chai.use(chaiHttp);

describe('Products', () => {
  beforeEach((done) => {
    Product.remove({}, (err) => {
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

      prod1.save((err, product) => {
        prod2.save((err, produ2) => {
          prod3.save((err, produ3) => {
            done();
          })
        })
      })
    })
  });

  it('Should display all products', (done) => {
    chai.request(server)
        .get('/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(3);
          done();
    });
  });

  it ('Should filter by title', (done) => {
    chai.request(server)
        .get('/products?title=Amazing')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(1);
          res.body[0].should.have.property('title').eql('Amazing');
          done();
    });
  });

  it ('Should filter by multiple values - price and store_id', (done) => {
    chai.request(server)
        .get('/products?store_id=123&price=100')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(1);
          res.body[0].should.have.property('title').eql('Amazing');
          done();
    });
  });

  it ('Should limit to 1 result', (done) =>{
    chai.request(server)
        .get('/products?store_id=123&limit=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(1);
          done();
    });
  });

  it ('Should sort by title', (done) =>{
    chai.request(server)
        .get('/products?sortby=title')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(3);
          res.body[0].should.have.property('title').eql('Amazing');
          res.body[1].should.have.property('title').eql('Even better!');
          res.body[2].should.have.property('title').eql('Much better!');
          done();
    });
  });
});