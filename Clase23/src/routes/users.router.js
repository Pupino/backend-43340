import { Router } from 'express';
import { generateUser } from '../utils/generateData.js';
import { userController } from '../controllers/users.controller.js';

const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
  const users = [];

  for (let i = 0; i < 100; i++) {
    users.push(generateUser());
  }

  res.send({ status: 'success', payload: users });
});

usersRouter.put('/premium/:uid', userController.setPremium);
//api/users/:uid/documents con el método POST que permita subir uno o múltiples archivos. Utilizar el middleware de Multer para poder recibir los documentos que se carguen y actualizar en el usuario su status para hacer saber que ya subió algún documento en particular.

export default usersRouter;
