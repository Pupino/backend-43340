import express from 'express';
import { UserModel } from '../DAO/models/users.model.js';
import { logger } from '../Utils/logger.js';

export const loginRouter = express.Router();

loginRouter.post('/register', async (req, res) => {
  const { firstName, lastName, age, email, password } = req.body;
  if (!firstName || !lastName || !age || !email || !password) {
    return res.status(400).render('error-page', { msg: 'faltan datos' });
  }
  try {
    await UserModel.create({
      firstName,
      lastName,
      age,
      email,
      password,
      admin: false,
    });
    req.session.firstName = firstName;
    req.session.email = email;
    req.session.admin = false;
    return res.redirect('/profile');
  } catch (e) {
    logger.error(`loginRouter /register error: ${e}`);
    return res
      .status(400)
      .render('error-page', { msg: 'controla tu email e intenta mas tarde' });
  }
});

loginRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render('error-page', { msg: 'faltan datos' });
  }
  if (email === 'adminCoder@coder.com' && password === 'adminCoder@coder.com') {
    req.session.firstName = 'Coder';
    req.session.lastName = 'House';
    req.session.email = email;
    req.session.admin = true;
    return res.redirect('/api/products');
  }
  try {
    const foundUser = await UserModel.findOne({ email });
    if (foundUser && foundUser.password === password) {
      req.session.firstName = foundUser.firstName;
      req.session.lastName = foundUser.lastName;
      req.session.email = foundUser.email;
      req.session.admin = foundUser.admin;
      //return res.redirect('/profile');
      return res.redirect('/api/products');
    } else {
      return res
        .status(400)
        .render('error-page', { msg: 'email o pass incorrectos' });
    }
  } catch (e) {
    logger.error(`loginRouter /login error: ${e}`);
    return res
      .status(500)
      .render('error-page', { msg: 'error inesperado en servidor' });
  }
});
