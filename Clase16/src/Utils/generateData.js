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
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    department: faker.commerce.department(),
    stock: faker.string.numeric(1), //faker.random.numeric(1),
    id: faker.database.mongodbObjectId(),
    image: faker.image.url(),
  };
};
