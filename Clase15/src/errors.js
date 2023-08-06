//@ts-check
const createErrorFactory = function (name) {
  return class BusinessError extends Error {
    constructor(message) {
      super(message);
      this.message = name;
      this.name = 'Custom App Error';
    }
  };
};

export const ConnectionError = createErrorFactory('Connection Error');
export const ValidationError = createErrorFactory(
  'All fields are mandatory: title, description, code, price, stock and category. Some is missing.'
);
export const CreationError = createErrorFactory(
  'Some error on persistance object creation'
);
