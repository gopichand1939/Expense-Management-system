import { Request, Response } from 'express';
import { prisma } from '../../config/client';
import dayjs from 'dayjs';

// 📊 Team Budget Dashboard (Used vs Left)
export const getTeamDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { team, month } = req.query;

    if (!team || !month) {
      res.status(400).json({ message: 'Team and month are required' });
      return;
    }

    const budget = await prisma.budget.findFirst({
      where: {
        team: String(team),
        month: String(month),
      },
    });

    if (!budget) {
      res.status(404).json({ message: 'No budget found for this team/month' });
      return;
    }

    const [monthName, year] = String(month).split(' ');
    const start = dayjs(`01 ${monthName} ${year}`).startOf('month').toDate();
    const end = dayjs(start).endOf('month').toDate();

    const expenses = await prisma.expense.findMany({
      where: {
        employee: { team: String(team) },
        createdAt: { gte: start, lte: end },
        status: 'APPROVED',
      },
    });

    const used = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = budget.limit - used;

    res.status(200).json({
      team,
      month,
      limit: budget.limit,
      used,
      remaining,
      isOverspent: remaining < 0,
      expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
};

// 📊 GET: Unified Chart Data - Category & Status (Bar & Pie)
export const getChartData = async (req: Request, res: Response): Promise<void> => {
  try {
    const team = (req as any).user.role === 'ADMIN' ? undefined : (req as any).user.team;

    const categorySummary = await prisma.expense.groupBy({
      by: ['category'],
      _sum: { amount: true },
      where: {
        status: 'APPROVED',
        ...(team && { employee: { team } }),
      },
    });

    const statusSummary = await prisma.expense.groupBy({
      by: ['status'],
      _count: { _all: true },
      ...(team && { where: { employee: { team } } }),
    });

    res.status(200).json({
      categorySummary,
      statusSummary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate chart data' });
  }
};
