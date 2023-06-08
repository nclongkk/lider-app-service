import { BadRequestException } from '@nestjs/common';

const users = [
  {
    _id: '68b47453-6991-462e-af64-5e3dc7d40ec4',
    email: 'eca1@ecomdy.com',
    stripeCustomerId: '',
    stripeCardId: '',
  },
  {
    _id: '90cac253-929d-47c2-bd2f-095259854551',
    email: 'eca2@ecomdy.com',
    stripeCustomerId: '',
    stripeCardId: '',
  },
];

export const getUserByEmail = async (email) => {
  const user = users.find((ele) => ele.email === email);
  if (!user) {
    throw new BadRequestException('User not found');
  }
  return user;
};

export const getUserById = async (id) => {
  const user = users.find((ele) => ele._id === id);
  if (!user) {
    throw new BadRequestException('User not found');
  }
  return user;
};
