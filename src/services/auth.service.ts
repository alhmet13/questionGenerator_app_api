import { prisma } from '../libs';

interface IUserData {
  email: string;
  name: string;
  password: string;
}

const createUser = async (data: IUserData) => {
  const user = await prisma.user.create({ data });
  return user;
};

const findUser = async (email: string) => {
  const user = prisma.user.findUnique({ where: { email } });
  return user;
};

const findUserById = async (userId: number) => {
  const user = prisma.user.findUnique({ where: { id: userId }, select: { id: true, uuid: true, name: true, email: true } });
  return user;
};

export { createUser, findUser, findUserById };
