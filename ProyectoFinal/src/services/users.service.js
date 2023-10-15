//@ts-check
import { usersModel } from '../dao/factory.js';
//import { productsModel } from '../dao/mongo/products.mongo.js';
//import { productsModel } from '../dao/memory/products.memory.js';
import { sendEmailTransport } from '../Utils/messaging.js';
import { entorno } from '../config.js';
import ProductDTO from '../dao/DTO/product.dto.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { createProductErrorInfo } from '../services/errors/info.js';
import { logger } from '../Utils/logger.js';
import { createHash, isValidPassword } from '../Utils/validations.js';

class UserService {
  async getUserByEmailPsw(email, password) {
    try {
      const user = await usersModel.getUserByEmail(email);
      if (user && isValidPassword(password, user.password)) {
        return user;
      } else {
        return false;
      }
    } catch (e) {
      throw e;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await usersModel.getUserByEmail(email);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async getUsers() {
    try {
      const users = await usersModel.getUsers();
      let rta = {
        status: 200,
        render: 'users-list',
        users,
      };
      return rta;
    } catch (e) {
      throw e;
    }
  }

  async getUserById(_id) {
    try {
      const user = await usersModel.getUserById(_id);
      //return user;
      let rta = {
        status: 200,
        render: 'user',
        user,
      };
      return rta;
    } catch (e) {
      throw e;
    }
  }

  async updateUser(_id, user) {
    try {
      if (user.password) {
        user.password = await createHash(user.password);
      }
      const userUpdated = await usersModel.updateUser(_id, user);
      return userUpdated;
    } catch (e) {
      throw e;
    }
  }

  async deleteUser(_id) {
    try {
      const userDeleted = await usersModel.deleteUser(_id);
      return userDeleted;
    } catch (e) {
      throw e;
    }
  }

  async cleanUsers() {
    try {
      const users = await usersModel.getUsers();
      let deletedUsers = [];
      if (users) {
        for (const user of users) {
          //call function that delete user if last connection is greater than 2 days
          const userClean = await this.cleanUserAfterDays(
            user._id,
            user.lastConnection,
            2
          );
          if (userClean) {
            deletedUsers.push(userClean);
          }
        }
      }
      if (deletedUsers.length === 0) {
        const msg = { mge: 'No users with inactivity were found' };
        deletedUsers.push(msg);
      }
      return deletedUsers;
    } catch (e) {
      throw e;
    }
  }

  async cleanUserAfterDays(id, lastConnection, days) {
    try {
      // Fecha almacenada en el campo (puedes obtenerla desde tu fuente de datos) --> lastConnection
      // Fecha actual
      const fechaActual = new Date();
      // Calcula la diferencia en milisegundos
      const diferenciaEnMilisegundos = fechaActual - lastConnection;
      // Calcula la diferencia en días
      const milisegundosPorDia = 1000 * 60 * 60 * 24; // 1 día = 24 horas * 60 minutos * 60 segundos * 1000 milisegundos
      const diferenciaEnDias = Math.floor(
        diferenciaEnMilisegundos / milisegundosPorDia
      );
      //if diference is more o equal to day number on parameter delete user
      if (diferenciaEnDias >= parseInt(days)) {
        const userDeleted = await usersModel.getUserById(id);
        const userClean = await usersModel.deleteUser(id);
        //enviar mail al usuario
        if (userDeleted) {
          const result = await sendEmailTransport.sendMail({
            from: entorno.GOOGLE_EMAIL,
            to: userDeleted.email,
            subject: 'Your account was removed, comeback!',
            html: `<div>
                        <p>Hi ${userDeleted.firstName}, your account was removed because you don't have activity for more than ${days} days</p>
                        <br>
                        <a href="${entorno.API_URL}/api/auth/register">Click here if you want to get a new account</a>
                      </div>`,
          });
        }
        return userDeleted;
      } else {
        return;
      }
    } catch (e) {
      throw e;
    }
  }

  async authenticateUser(email, password) {
    try {
      const user = await usersModel.getUserByEmail(email);
      if (!user || !isValidPassword(password, user.password)) {
        throw new Error('Invalid credentials');
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  async registerUser(
    email,
    password,
    firstName,
    lastName,
    age,
    isAdmin,
    isPremium
  ) {
    try {
      const existingUser = await usersModel.getUserByEmail(email);

      if (existingUser) {
        throw new Error('User already exists');
      }
      const hashedPassword = createHash(password);
      const userCreated = await usersModel.createUser(
        email,
        hashedPassword,
        firstName,
        lastName,
        age,
        isAdmin,
        isPremium
      );

      return userCreated;
    } catch (e) {
      throw e;
    }
  }

  async premiumSwitch(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('Usuario inexistente');
      }
      user.user.isPremium = !user.user.isPremium;
      const updatedUser = await this.updateUser(userId, {
        isPremium: user.user.isPremium,
      });
      return user;
    } catch (e) {
      throw e;
    }
  }

  async setPremium(id) {
    try {
      const userUpdated = await usersModel.setPremium(id);
      return userUpdated;
    } catch (e) {
      throw e;
    }
  }
}
export const userService = new UserService();
