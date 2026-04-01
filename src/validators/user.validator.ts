import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateUserStatusSchema = z.object({
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
});
