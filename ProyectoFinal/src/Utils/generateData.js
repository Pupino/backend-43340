import { faker } from '@faker-js/faker';

//faker.locale = 'es';

export const generateUser = () => {
  const numOfProducts = parseInt(
    faker.string.numeric(1, { bannedDigits: ['0'] })
  );
  const products = [];

  for (let i = 0; i < numOfProducts; i++) {
    products.push(generateProduct());
  }

  return {
    name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    birthgDate: faker.date.birthdate(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    sex: faker.person.sex(),
    products,
  };
};

export const generateProduct = () => {
  //throw new Error('Forcing an error');
  return {
    //_id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.lorem.word(5),
    price: faker.commerce.price(),
    stock: faker.string.numeric(2),
    category: faker.commerce.department(),
    status: faker.datatype.boolean(),
  };
};
