import * as chai from 'chai';  
import chaiHttp from 'chai-http';
import app from '../../index.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Products API', () => {
  it('should get a list of products', (done) => {
    chai.request(app)
      .get('/api/products')
      .end((_, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('payload').that.is.an('array');
        done();
      });
  });

  it('should create a new product', (done) => {
    const newProduct = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 100,
      stock: 10
    };

    chai.request(app)
      .post('/api/products')
      .send(newProduct)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title', newProduct.title);
        done();
      });
  });
});
