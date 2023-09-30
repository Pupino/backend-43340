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
      return res.status(200).json({
        status: 'success',
        msg: 'listado de usuarios',
        payload: users,
      });
    } catch (e) {
      logger.error(e.message);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        payload: {},
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { _id } = req.params;
      const userById = await userService.getUserById(_id);
      return res.status(201).json({
        status: 'success',
        msg: `Mostrando el usuario con id ${_id}`,
        payload: { userById },
      });
    } catch (e) {
      logger.error(e.message);
    }
  }

  async update(req, res) {
    try {
      const { _id } = req.params;
      const { email, password, firstName, lastName, age } = req.body;
      let user = new UserDTO({ email, password, firstName, lastName, age });
      try {
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
        return res.status(500).json({
          status: 'error',
          msg: 'db server error while updating user',
          payload: {},
        });
      }
    } catch (e) {
      logger.error(e.message);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        payload: {},
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { _id } = req.params;
      const result = await userService.deleteUser(_id);
      if (result?.deletedCount > 0) {
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
      logger.error(e.message);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        payload: {},
      });
    }
  }

  async loginUser(email, password) {
    try {
      const user = await userService.authenticateUser(email, password);
      return user;
    } catch (e) {
      logger.error(e.message);
      return null;
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
      logger.error(e.message);
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
      res.status(404).json({ error: e.message });
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
      res.status(404).json({ error: e.message });
    }
  }
}

export const userController = new UserController();
