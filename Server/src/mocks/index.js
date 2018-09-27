import faker from 'faker';

import Sheet from '../models/Sheet';
import User from '../models/User';

const SHEETS_TOTAL = 3;
const USERS_TOTAL = 3;

export default async () => {
  try {
    await Sheet.remove();
    await User.remove();

    await Array.from({ length: USERS_TOTAL }).forEach(async (_, i) => {
      const user = await User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        companyName: faker.company.companyName(),
        avatar: `https://randomuser.me/api/portraits/women/${i}.jpg`,
        password: 'password123'
      });

      await Array.from({ length: SHEETS_TOTAL }).forEach(
        async () => await Sheet.create({ text: faker.lorem.sentence(), user: user._id }),
      );
    });
  } catch (error) {
    throw error;
  }
};