import { prisma } from '../utils/prisma';

export const createRecord = async (userId: string, data: any) => {
  return await prisma.record.create({
    data: {
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: new Date(data.date),
      description: data.description,
      createdById: userId,
    },
  });
};

export const updateRecord = async (recordId: string, data: any) => {
  const existingRecord = await prisma.record.findFirst({ where: { id: recordId, deletedAt: null } });
  if (!existingRecord) {
    const error: any = new Error('Record not found');
    error.statusCode = 404;
    throw error;
  }

  const updateData: any = { ...data };
  if (data.date) updateData.date = new Date(data.date);

  return await prisma.record.update({
    where: { id: recordId },
    data: updateData,
  });
};

export const deleteRecord = async (recordId: string) => {
  const existingRecord = await prisma.record.findFirst({ where: { id: recordId, deletedAt: null } });
  if (!existingRecord) {
    const error: any = new Error('Record not found');
    error.statusCode = 404;
    throw error;
  }

  return await prisma.record.update({
    where: { id: recordId },
    data: { deletedAt: new Date() }
  });
};

export const getRecords = async (filters: { category?: string; type?: string; startDate?: string; endDate?: string }) => {
  const where: any = { deletedAt: null };

  if (filters.category) where.category = filters.category;
  if (filters.type) where.type = filters.type;
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = new Date(filters.startDate);
    if (filters.endDate) where.date.lte = new Date(filters.endDate);
  }

  return await prisma.record.findMany({
    where,
    orderBy: { date: 'desc' },
  });
};

export const getRecordById = async (recordId: string) => {
  const record = await prisma.record.findFirst({ where: { id: recordId, deletedAt: null } });
  if (!record) {
    const error: any = new Error('Record not found');
    error.statusCode = 404;
    throw error;
  }
  return record;
};
