import * as chai from 'chai';  
import chaiHttp from 'chai-http';
import app from '../../index.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Carts API', () => {
  it('should create a new cart', (done) => {
    chai.request(app)
      .post('/api/carts')
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('products').that.is.an('array');
        done();
      });
  });

  it('should add a product to the cart', (done) => {
    const cartId = 'id-del-carrito';  
    const productId = 'id-del-producto';  
    const quantity = 2;

    chai.request(app)
      .put(`/api/carts/${cartId}/products/${productId}`)
      .send({ quantity })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('products').that.is.an('array');
        done();
      });
  });
});
