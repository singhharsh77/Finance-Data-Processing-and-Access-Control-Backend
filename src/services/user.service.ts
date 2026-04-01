import { prisma } from '../utils/prisma';

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: { id: true, email: true, role: true, isActive: true, createdAt: true },
  });
};

export const updateUserStatus = async (id: string, data: { role?: string; isActive?: boolean }) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, role: true, isActive: true },
  });
};
