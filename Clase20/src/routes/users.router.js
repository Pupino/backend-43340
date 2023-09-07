import { Router } from 'express';
import { generateUser } from '../utils/generateData.js';

const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
  const users = [];

  for (let i = 0; i < 100; i++) {
    users.push(generateUser());
  }

  res.send({ status: 'success', payload: users });
});

export default usersRouter;
