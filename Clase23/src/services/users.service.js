//@ts-check
import { usersModel } from '../dao/factory.js';
//import { productsModel } from '../dao/mongo/products.mongo.js';
//import { productsModel } from '../dao/memory/products.memory.js';
import ProductDTO from '../dao/DTO/product.dto.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { createProductErrorInfo } from '../services/errors/info.js';
import { logger } from '../Utils/logger.js';
import { createHash, isValidPassword } from '../Utils/validations.js';

class UserService {
  async getUserByEmail(email, password) {
    try {
      const user = await usersModel.getUserByEmail(email);
      if (user && isValidPassword(password, user.password)) {
        return user;
      } else {
        return false;
      }
    } catch (e) {
      logger.error(e.message);
      //Romina: falta CustomError.createError
    }
  }

  async getUsers() {
    try {
      const users = await usersModel.getUsers();
      return users;
    } catch (e) {
      logger.error(e.message);
      //Romina: falta CustomError.createError
    }
  }

  async getUserById(_id) {
    try {
      const user = await usersModel.getUserById(_id);
      return user;
    } catch (e) {
      logger.error(e.message);
      //Romina: falta CustomError.createError
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
      logger.error(e.message);
      //Romina: falta CustomError.createError
    }
  }

  async deleteUser(_id) {
    try {
      const userDeleted = await usersModel.deleteUser(_id);
      return userDeleted;
    } catch (e) {
      logger.error(e.message);
      //Romina: falta CustomError.createError
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
      logger.error(e.message);
      //Romina: falta CustomError.createError
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
      const userCreated = await usersModel.create(
        firstName,
        lastName,
        age,
        email,
        hashedPassword,
        isAdmin,
        isPremium
      );

      return userCreated;
    } catch (e) {
      logger.error(e.message);
      //Romina: falta CustomError.createError
      throw e;
    }
  }

  async premiumSwitch(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('Usuario inexistente');
      }
      user.isPremium = !user.isPremium;
      const updatedUser = await this.updateUser(userId, {
        isPremium: user.isPremium,
      });
      return user;
    } catch (e) {
      logger.error(e.message);
      throw e;
    }
  }

  async setPremium(id) {
    try {
      const userUpdated = await usersModel.setPremium(id);
      return userUpdated;
    } catch (e) {
      logger.error(e.message);
      //Romina: falta CustomError.createError
    }
  }
}
export const userService = new UserService();
