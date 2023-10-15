import EErros from '../services/errors/enum.js';
import { logger } from '../Utils/logger.js';

export default (error, req, res, next) => {
  switch (error.code) {
    case EErros.FAKER_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GITHUB_SESSION_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.CURRENT_SESSION_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_PRODUCTS_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_PRODUCT_BY_ID_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.CREATE_PRODUCT_ERROR:
      logger.error(`Error: ${error} - Cause: ${error.cause}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.UPDATE_PRODUCT_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.DELETE_PRODUCT_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.CRETE_PRODUCT_FORM_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_ALL_CARTS_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_CART_BY_ID_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.CREATE_EMPTY_CART_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.UPDATE_PRODUCTS_CART_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.UPDATE_PROD_QTY_CART_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.REMOVE_PROD_CART_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.REMOVE_ALL_PROD_CART_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.PURCHASE_CART_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_SESSION_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_REGISTER_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.POST_REGISTER_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.FAIL_REGISTER_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.LOGIN_FORM_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.LOGIN_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.FAIL_LOGIN_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_ADMIN_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.PRODUCT_ID_VALIDATION:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.PRODUCT_ID_VALIDATION_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_ALL_PRODUCTS_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.CHAT_SOCKET_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_HOME_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_LOGIN_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.GET_LOGOUT_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.CREATE_CODE_FROM_EMAIL_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.RECOVER_PASS_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.SAVING_NEW_PASS_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.PRODUCT_UPDATE_VALIDATION_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    case EErros.PRODUCT_DELETE_VALIDATION_ERROR:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
        errorBackend: error,
      });
      break;
    default:
      logger.error(`error.code: ${error.code} - ${error}`);
      res.send({
        status: 'error',
        error: 'Unhandled error',
      });
      break;
  }
};
