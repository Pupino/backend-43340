import { RecoverCodesModel } from './models/recover-codes.model.js';

export default class RecoverCodes {
  async storeCode(email, code) {
    const storeCode = await RecoverCodesModel.create({
      email,
      code,
      expire: Date.now() + 1 * 60 * 60 * 1000,
    });
    return storeCode;
  }

  async foundCode(email, code) {
    const foundRecoverCode = await RecoverCodesModel.findOne({
      email,
      code,
    });
    return foundRecoverCode;
  }
}
