import { prisma } from '../utils/prisma';

export const getDashboardSummary = async () => {
  const totalIncomeAggr = await prisma.record.aggregate({
    _sum: { amount: true },
    where: { type: 'INCOME', deletedAt: null },
  });

  const totalExpenseAggr = await prisma.record.aggregate({
    _sum: { amount: true },
    where: { type: 'EXPENSE', deletedAt: null },
  });

  const totalIncome = totalIncomeAggr._sum.amount || 0;
  const totalExpenses = totalExpenseAggr._sum.amount || 0;

  const categoryGroup = await prisma.record.groupBy({
    by: ['category'],
    _sum: { amount: true },
    where: { deletedAt: null },
  });

  const categoryTotals: Record<string, number> = {};
  categoryGroup.forEach(group => {
    categoryTotals[group.category] = group._sum.amount || 0;
  });

  const netBalance = totalIncome - totalExpenses;

  const recentActivity = await prisma.record.findMany({
    where: { deletedAt: null },
    orderBy: { date: 'desc' },
    take: 5,
  });

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals,
    recentActivity,
  };
};
