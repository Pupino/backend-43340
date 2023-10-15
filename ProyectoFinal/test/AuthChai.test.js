import chai from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

await mongoose.connect(
  ''
);

describe('Testing Auth Register, Auth Login and Current Session', () => {
  let cookieName;
  let cookieValue;
  const mockUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: 20,
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  it('A User should be register', async () => {
    const _body = await requester.post('/api/auth/register').send(mockUser);
    expect(_body).to.be.ok;
  });

  it('User previously created should login and retrieve a cookie', async () => {
    const result = await requester.post('/api/auth/login').send({
      email: mockUser.email,
      password: mockUser.password,
    });

    const cookie = result.headers['set-cookie'][0];
    expect(cookie).to.be.ok;

    cookieName = cookie.split('=')[0];
    cookieValue = cookie.split('=')[1];

    expect(cookieName).to.be.ok.and.eql('connect.sid');
    expect(cookieValue).to.be.ok;
  });

  it('Send cookie to check user session', async () => {
    const _body = await requester
      .get('/api/sessions/current')
      .set('Cookie', [`${cookieName}=${cookieValue}`]);
    const text = JSON.parse(_body.text);
    expect(text.email).to.be.eql(mockUser.email);
  });
});
