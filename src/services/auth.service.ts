import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

export const registerUser = async (data: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    const error: any = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: hashedPassword,
      role: data.role || 'VIEWER',
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });

  return { id: user.id, email: user.email, role: user.role };
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.isActive) {
    const error: any = new Error('Invalid credentials or inactive user');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(data.password, user.passwordHash);
  if (!isMatch) {
    const error: any = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ userId: user.id, role: user.role });

  return { token, user: { id: user.id, email: user.email, role: user.role } };
};
