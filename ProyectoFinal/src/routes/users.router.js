import { Router } from 'express';
import { generateUser } from '../utils/generateData.js';
import { userController } from '../controllers/users.controller.js';
import { isUser, isAdmin, isPremiumOrAdmin } from '../middlewares/auth.js';

const usersRouter = Router();
usersRouter.get('/', isAdmin, userController.getUsers);
usersRouter.get('/:uid', isAdmin, userController.getUserById);
usersRouter.put('/premium/:uid', isAdmin, userController.setPremium);
usersRouter.put('/premiumSwitch/:uid', isAdmin, userController.premiumSwitch);
//api/users/:uid/documents con el método POST que permita subir uno o múltiples archivos. Utilizar el middleware de Multer para poder recibir los documentos que se carguen y actualizar en el usuario su status para hacer saber que ya subió algún documento en particular.
usersRouter.delete('/:uid', isAdmin, userController.deleteUser); //ROMINA: ofrecer una vista desde donde llamar a la api al
usersRouter.get('/cleanUsers', isAdmin, userController.cleanUsers);

usersRouter.get('/generateUsers', async (req, res) => {
  const users = [];
  for (let i = 0; i < 100; i++) {
    users.push(generateUser());
  }
  res.send({ status: 'success', payload: users });
});

export default usersRouter;
