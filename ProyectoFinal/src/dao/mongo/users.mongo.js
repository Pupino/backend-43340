import { UserModel } from './models/users.model.js';
import { logger } from '../../Utils/logger.js';

export default class UsersModel {
  async getUserByEmail(email) {
    try {
      const user = await UserModel.findOne(
        { email: email },
        {
          _id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          age: true,
          isAdmin: true,
          isPremium: true,
        }
      );
      return user;
    } catch (e) {
      logger.error(e.message);
    }
  }

  async getUsers() {
    try {
      const users = await UserModel.find({}, { __v: false }).select(
        '_id email -password firstName lastName -age isAdmin isPremium lastConnection'
      );
      return users;
    } catch (e) {
      logger.error(e.message);
    }
  }

  async getUserById(_id) {
    try {
      const userById = await UserModel.findOne({ _id });
      return userById;
    } catch (e) {
      logger.error(e.message);
    }
  }

  async createUser(
    email,
    password,
    firstName,
    lastName,
    age,
    isAdmin,
    isPremium
  ) {
    try {
      const userCreated = await UserModel.create({
        email,
        password,
        firstName,
        lastName,
        age,
        isAdmin,
        isPremium,
      });
      return userCreated;
    } catch (e) {
      logger.error(e.message);
    }
  }

  async updateUser(_id, user) {
    try {
      const userUpdated = await UserModel.findByIdAndUpdate(_id, user, {
        new: true,
      });
      return userUpdated;
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  }

  async deleteUser(_id) {
    try {
      const deletedUser = await UserModel.deleteOne({ _id: _id });
      return deletedUser;
    } catch (e) {
      logger.error(e.message);
    }
  }

  async setPremium(id) {
    try {
      const userUpdated = await UserModel.updateOne(
        { _id: id },
        {
          isPremium: true,
        }
      );
      return userUpdated;
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  }

  async setLastConnection(id) {
    try {
      const userUpdated = await UserModel.updateOne(
        { _id: id },
        {
          lastConnection: new Date(),
        }
      );
      return userUpdated;
    } catch (e) {
      logger.error(e.message);
      return e;
    }
  }
}

//export const usersModel = new UsersModel();
