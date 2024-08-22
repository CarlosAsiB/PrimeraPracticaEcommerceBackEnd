import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Sessions API', () => {
  it('should register a new user', (done) => {
    const newUser = {
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      age: 30,
      password: 'password123'
    };

    chai.request(app)
      .post('/register')
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should login the user', (done) => {
    const user = {
      username: 'johndoe',
      password: 'password123'
    };

    chai.request(app)
      .post('/login')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
