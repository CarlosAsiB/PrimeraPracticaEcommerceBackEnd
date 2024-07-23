import { faker } from '@faker-js/faker';

export const generateMockProducts = (count) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    products.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      stock: faker.random.number({ min: 1, max: 100 }),
      category: faker.commerce.department(),
    });
  }
  return products;
};
