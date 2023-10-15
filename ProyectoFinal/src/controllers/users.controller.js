//@ts-check
import { userService } from '../services/users.service.js';
import UserDTO from '../dao/DTO/user.dto.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { logger } from '../Utils/logger.js';

class UserController {
  async getUsers(req, res) {
    try {
      const users = await userService.getUsers();
      return res.render(users.render, {
        payload: users.users.map((user) => ({
          //Needs to do map format ir order to pass to Handlebars
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin ? 'Yes' : 'No',
          isPremium: user.isPremium ? 'Yes' : 'No',
          lastConnection: user.lastConnection,
        })),
      });
    } catch (e) {
      logger.error(`UserController.getUsers: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Home error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.GET_USERS_ERROR,
      });
    }
  }

  async getUserById(req, res) {
    try {
      const userId = req.params.uid;
      const userById = await userService.getUserById(userId);
      //romina devolver vista para permitir editar y eliminar usuario
      const userFormatted = {
        id: userById.user._id,
        email: userById.user.email,
        firstName: userById.user.firstName,
        lastName: userById.user.lastName,
        isAdmin: userById.user.isAdmin ? 'Yes' : 'No',
        isPremium: userById.user.isPremium ? 'Yes' : 'No',
        lastConnection: userById.user.lastConnection,
        isAdmin: userById.user.isAdmin ? 'Yes' : 'No',
        isPremium: userById.user.isPremium ? 'Yes' : 'No',
      };

      return res.render(userById.render, {
        payload: userFormatted,
      });
      // return res.status(201).json({
      //   status: 'success',
      //   msg: `Mostrando el usuario con id ${userId}`,
      //   payload: { userById },
      // });
    } catch (e) {
      logger.error(`UserController.getUserById: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Get User by Id',
        cause: 'Please contact development team',
        message: e,
        code: EErros.GET_USERS_ERROR,
      });
    }
  }

  async update(req, res) {
    try {
      const { _id } = req.params;
      const { email, password, firstName, lastName, age } = req.body;
      let user = new UserDTO({ email, password, firstName, lastName, age });
      const userUpdated = await userService.updateUser(_id, user);
      if (userUpdated) {
        return res.status(201).json({
          status: 'success',
          msg: 'user uptaded',
          payload: {},
        });
      } else {
        return res.status(404).json({
          status: 'error',
          msg: 'user not found',
          payload: {},
        });
      }
    } catch (e) {
      logger.error(`UserController.update: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Update User',
        cause: 'Please contact development team',
        message: e,
        code: EErros.UPDATE_USER_ERROR,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.uid;
      const result = await userService.deleteUser(userId);
      if (result.deletedCount > 0) {
        return res.status(200).json({
          status: 'success',
          msg: 'user deleted',
          payload: {},
        });
      } else {
        return res.status(404).json({
          status: 'error',
          msg: 'user not found',
          payload: {},
        });
      }
    } catch (e) {
      logger.error(`UserController.deleteUser: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Delete User',
        cause: 'Please contact development team',
        message: e,
        code: EErros.DELETE_USER_ERROR,
      });
    }
  }

  async loginUser(email, password) {
    try {
      const user = await userService.authenticateUser(email, password);
      return user;
    } catch (e) {
      logger.error(`UserController.loginUser: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Login User',
        cause: 'Please contact development team',
        message: e,
        code: EErros.LOGIN_USER_ERROR,
      });
      //return null;
    }
  }

  async registerUser(req) {
    try {
      const { email, password, firstName, lastName, age } = req.body;
      const isAdmin = false;
      const userCreated = await userService.registerUser(
        email,
        password,
        firstName,
        lastName,
        age,
        isAdmin
      );
      return userCreated;
    } catch (e) {
      logger.error(`UserController.registerUser: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Register User',
        cause: 'Please contact development team',
        message: e,
        code: EErros.REGISTER_USER_ERROR,
      });
      return null;
    }
  }

  async premiumSwitch(req, res) {
    try {
      const userId = req.params.uid;
      const user = await userService.premiumSwitch(userId);
      req.session.user.isPremium = user.isPremium;
      res.status(200).json(user);
    } catch (e) {
      logger.error(`UserController.premiumSwitch: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Switch User to Premium',
        cause: 'Please contact development team',
        message: e,
        code: EErros.PREMIUM_USER_ERROR,
      });
    }
  }

  async setPremium(req, res) {
    try {
      const userId = req.params.uid;
      const user = await userService.setPremium(userId);
      return res.status(200).json({
        status: 'success',
        msg: `user id ${userId} set as Premium`,
        payload: {},
      });
    } catch (e) {
      logger.error(`UserController.setPremium: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Set User to Premium',
        cause: 'Please contact development team',
        message: e,
        code: EErros.PREMIUM_USER_ERROR,
      });
    }
  }

  async cleanUsers(req, res) {
    try {
      const usersCleaned = await userService.cleanUsers();
      return res.status(200).json({
        status: 'success',
        msg: `Cleaning Done! List of deleted users on payload`,
        payload: usersCleaned,
      });
    } catch (e) {
      logger.error(`UserController.cleanUsers: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Clean Users',
        cause: 'Please contact development team',
        message: e,
        code: EErros.CLEAN_USERS_ERROR,
      });
    }
  }
}

export const userController = new UserController();
