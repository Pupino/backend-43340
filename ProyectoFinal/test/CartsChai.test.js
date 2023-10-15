import chai from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { CartModel } from '../src/dao/mongo/models/carts.model.js';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

await mongoose.connect(
  ''
);

let cookieName;
let cookieValue;
let cart;
let cartId;

describe('Testing Carts', () => {
  it('Existing user should login and retrieve a cookie', async () => {
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

  //Nice to have: antes ir a recuperar de la bbdd un cartId en vez de hardcodearlo
  //si no hay crear uno y obtener su ID
  it('Get Cart Id to use it', async () => {
    cart = await CartModel.findOne();
    if (cart) {
      cartId = cart._id;
      expect(cartId).to.be.string;
    } else {
      //crear uno nuevo
      console.log('NO encontro un cart');
      const _body = await requester
        .post('/api/carts')
        .set('Cookie', [`${cookieName}=${cookieValue}`]);

      cart = _body.text;
      cart = JSON.parse(cart);
      cartId = cart.data.id;
      expect(_body.status).to.be.equal(200);
      expect(_body.text).to.include('cart created');
    }
  });

  it('Get all Carts with valid session', async () => {
    console.log(`cookieName: ${cookieName}`);
    console.log(`cookieValue: ${cookieValue}`);
    const _body = await requester
      .get('/api/carts')
      .set('Cookie', [`${cookieName}=${cookieValue}`]);

    const status = _body.status;
    console.log(`status: ${JSON.stringify(status)}`);

    expect(status).to.be.equal(200);
    expect(_body.text).to.include('carts list');
  });

  it('Get a Cart by ID', async () => {
    const _body = await requester
      .get(`/api/carts/${cartId}`)
      .set('Cookie', [`${cookieName}=${cookieValue}`]);

    expect(_body.status).to.be.equal(200);
    expect(_body).to.have.property('headers');
    expect(_body.headers)
      .to.have.property('content-type')
      .that.includes('text/html');
    expect(_body.text).to.include('<strong>Cart Products</strong>');
  });

  it('Create an Empty New Cart', async () => {
    const _body = await requester
      .post('/api/carts')
      .set('Cookie', [`${cookieName}=${cookieValue}`]);

    //console.log(`_body: ${JSON.stringify(_body)}`);
    expect(_body.status).to.be.equal(200);
    expect(_body.text).to.include('cart created');
  });

  it('Update Products on Cart', async () => {
    const requestBodyProd = {
      prodsArray: [
        {
          prodId: '648bae59b7b670f1a3a09662',
          quantity: 3,
        },
        {
          prodId: '648bae59b7b670f1a3a09660',
          quantity: 5,
        },
        {
          prodId: '648bae59b7b670f1a3a09666',
          quantity: 10,
        },
      ],
    };

    const _body = await requester
      .put(`/api/carts/${cartId}`)
      .set('Cookie', [`${cookieName}=${cookieValue}`])
      .send(requestBodyProd);

    expect(_body.status).to.be.equal(200);
    expect(_body.text).to.include('products array updated on cart');
  });

  it('Update specific Product quantity on Cart', async () => {
    const cid = '64d571eedf1a790fa8f5be5d'; //hardocoded
    const pid = '648e28db81adab7472707ad4'; //hardocoded
    const requestBodyProd = {
      quantity: 30,
    };

    const _body = await requester
      .put(`/api/carts/${cid}/products/${pid}`)
      .set('Cookie', [`${cookieName}=${cookieValue}`])
      .send(requestBodyProd);

    expect(_body.status).to.be.equal(200);
    expect(_body.text).to.include('product updated on cart');
  });

  it('Delete specific Product on Cart', async () => {
    const cid = '64d6372a1092a43ea60025a4'; //hardocoded
    const pid = '648bae59b7b670f1a3a09668'; //hardocoded

    const _body = await requester
      .delete(`/api/carts/${cid}/products/${pid}`)
      .set('Cookie', [`${cookieName}=${cookieValue}`]);

    expect(_body.status).to.be.equal(200);
    expect(_body.text).to.include('product deleted from cart');
  });

  it('Delete all products from specific cart Id', async () => {
    const _body = await requester
      .delete(`/api/carts/${cartId}`)
      .set('Cookie', [`${cookieName}=${cookieValue}`]);

    expect(_body.status).to.be.equal(200);
    expect(_body.text).to.include('All products deleted from cart');
  });

  //Excede los 2000ms revisar!
  it('Purchase an specific cart Id', async () => {
    const cid = '65034ac2efa8fae81b8ba67c'; //hardocoded

    const _body = await requester
      .post(`/api/carts/${cid}/purchase`)
      .set('Cookie', [`${cookieName}=${cookieValue}`]);

    //console.log(`_body: ${JSON.stringify(_body)}`);
    expect(_body.status).to.be.equal(200);
    expect(_body.text).to.include('Products situation are:');
  });
});
