import chai from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { ProductModel } from '../src/dao/mongo/models/products.model.js';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

await mongoose.connect(
  ''
);

let cookieName;
let cookieValue;
let product;
let productId;

describe('Testing Products', () => {
  it('Exist user should login and retrieve a cookie', async () => {
    const result = await requester.post('/api/auth/login').send({
      email: 'romina.jalon@gmail.com', //set an existing user on ddbb
      password: '123456',
    });

    const cookie = result.headers['set-cookie'][0];
    expect(cookie).to.be.ok;

    cookieName = cookie.split('=')[0];
    cookieValue = cookie.split('=')[1];

    expect(cookieName).to.be.ok.and.eql('connect.sid');
    expect(cookieValue).to.be.ok;
  });

  //Nice to have: antes ir a recuperar de la bbdd un ProductId en vez de hardcodearlo
  //si no hay crear uno y obtener su ID
  it('Get Product Id to use it', async () => {
    product = await ProductModel.findOne();
    if (product) {
      productId = product._id;
      expect(productId).to.be.string;
    } else {
      //crear uno nuevo
      const requestBodyMockProd = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.finance.creditCardNumber(),
        price: faker.finance.amount(),
        stock: faker.finance.accountNumber(),
        category: faker.commerce.department(),
      };

      const _body = await requester
        .post('/api/products')
        .set('Cookie', [`${cookieName}=${cookieValue}`])
        .send(requestBodyMockProd);

      product = _body.text;
      product = JSON.parse(product);
      productId = product.data._id;
      expect(_body.status).to.be.equal(200);
      expect(_body.text).to.include('product created');
    }
  });

  it('Get all Products with valid session', async () => {
    const _body = await requester
      .get('/api/products')
      .set('Cookie', [`${cookieName}=${cookieValue}`]);

    const status = _body.status;

    expect(status).to.be.equal(200);
    expect(_body).to.have.property('headers');
    expect(_body.headers)
      .to.have.property('content-type')
      .that.includes('text/html');
    expect(_body.text).to.include('<strong>Products</strong>');
  });

  it('Get Form to create a Product with valid session', async () => {
    const _body = await requester
      .get('/api/products/create')
      .set('Cookie', [`${cookieName}=${cookieValue}`]);

    expect(_body.status).to.be.equal(200);
    expect(_body).to.have.property('headers');
    expect(_body.headers)
      .to.have.property('content-type')
      .that.includes('text/html');
    expect(_body.text).to.include("<form action='/api/products'");
    expect(_body.text).to.include('</html>');
    expect(_body.text).to.include('<body>');
  });

  it('Create a New Product', async () => {
    const requestBodyMockProd = {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.finance.creditCardNumber(),
      price: faker.finance.amount(),
      stock: faker.finance.accountNumber(),
      category: faker.commerce.department(),
    };

    const _body = await requester
      .post('/api/products')
      .set('Cookie', [`${cookieName}=${cookieValue}`])
      .send(requestBodyMockProd);

    expect(_body.status).to.be.equal(200);
    expect(_body.text).to.include('product created');
  });

  it('Update a Product by ID', async () => {
    const requestBodyProd = {
      product: {
        title: 'Product DR',
        description: 'Desc Prod U',
        code: 'DR2020',
        price: 450000,
        stock: 2,
        category: 'RJDZ',
      },
    };

    const _body = await requester
      .put(`/api/products/${productId}`)
      .set('Cookie', [`${cookieName}=${cookieValue}`])
      .send(requestBodyProd);

    expect(_body.status).to.be.equal(200);
    expect(_body.text).to.include('product updated');
  });

  it('Get a Product by ID', async () => {
    const _body = await requester
      .get(`/api/products/${productId}`)
      .set('Cookie', [`${cookieName}=${cookieValue}`]);

    expect(_body.status).to.be.equal(200);
    expect(_body.text).to.include('product list');
  });

  it('Delete a Product by ID', async () => {
    const _body = await requester
      .delete(`/api/products/${productId}`)
      .set('Cookie', [`${cookieName}=${cookieValue}`]);

    expect(_body.status).to.be.equal(200);
    expect(_body.text).to.include('product deleted');
  });
});
