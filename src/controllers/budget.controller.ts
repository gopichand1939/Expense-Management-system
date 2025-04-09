import { Request, Response } from 'express';
import { prisma } from '../config/client';
import dayjs from 'dayjs';

// ✅ (EXISTING) Set Budget API - Admin sets budget for team & month
export const setBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { team, limit, month } = req.body;

    const budget = await prisma.budget.create({
      data: {
        team,
        limit: parseFloat(limit),
        month,
      },
    });

    res.status(201).json({ message: 'Budget set successfully', budget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to set budget' });
  }
};

// ✅ (EXISTING) Get All Budgets - Fetches all team budgets
export const getBudgets = async (req: Request, res: Response): Promise<void> => {
  try {
    const budgets = await prisma.budget.findMany();
    res.status(200).json({ budgets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
};

// ✅ (✨ NEW) Track Budget Usage by Team & Month
// Ex: ?team=Engineering&month=April 2025
export const getTeamBudgetStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { team, month } = req.query;

    // ❌ Validate query params
    if (!team || !month) {
      res.status(400).json({ message: 'Team and month are required' });
      return;
    }

    // ✅ Fetch budget for the given team & month
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

    // ✅ Calculate start and end date from month
    const [monthName, year] = String(month).split(' ');
    const start = dayjs(`01 ${monthName} ${year}`).startOf('month').toDate();
    const end = dayjs(start).endOf('month').toDate();

    // ✅ Aggregate approved expenses for this team in this month
    const totalSpent = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        employee: { team: String(team) },
        createdAt: {
          gte: start,
          lte: end,
        },
        status: 'APPROVED',
      },
    });

    const used = totalSpent._sum.amount || 0;
    const remaining = budget.limit - used;

    // ✅ Respond with budget tracking info
    res.status(200).json({
      team,
      month,
      limit: budget.limit,
      used,
      remaining,
      isOverspent: remaining < 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to calculate budget status' });
  }
};
