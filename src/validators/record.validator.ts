import { z } from 'zod';

export const createRecordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  date: z.string().datetime(), // ISO 8601 string
  description: z.string().optional(),
});

export const updateRecordSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  description: z.string().optional(),
});

export const getRecordsQuerySchema = z.object({
  category: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
