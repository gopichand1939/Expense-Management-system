// ✅ FILE: src/controllers/admin.controller.ts

import { Request, Response } from 'express';
import { prisma } from '../config/client';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

// ✅ 1. Admin Creates User
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({
      message: 'User created by Admin successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// ✅ 2. Admin Dashboard
export const getAdminDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentMonth = dayjs().format('MMMM YYYY');

    const budgets = await prisma.budget.findMany({
      where: { month: currentMonth },
    });

    const teamOverview = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await prisma.expense.findMany({
          where: {
            employee: { team: budget.team },
            createdAt: {
              gte: dayjs().startOf('month').toDate(),
              lte: dayjs().endOf('month').toDate(),
            },
            status: 'APPROVED',
          },
        });

        const used = expenses.reduce((sum, e) => sum + e.amount, 0);

        return {
          team: budget.team,
          month: currentMonth,
          limit: budget.limit,
          used,
          remaining: budget.limit - used,
          isOverspent: used > budget.limit,
        };
      })
    );

    const allExpenses = await prisma.expense.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        category: true,
        amount: true,
        status: true,
      },
    });

    res.status(200).json({ teamOverview, expenses: allExpenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load admin dashboard' });
  }
};
