import { faker } from '@faker-js/faker';

export const getMockProducts = (res) => {
  const mockProducts = [];
  for (let i = 0; i < 50; i++) {
    mockProducts.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      thumbnail: faker.image.imageUrl(),
      code: faker.datatype.uuid(),
      stock: faker.datatype.number({ min: 1, max: 100 }),
      owner: 'admin'
    });
  }
  res.json(mockProducts);
};
