// ✅ FILE: backend/controllers/admin.controller.ts

import { Request, Response } from 'express';
import { prisma } from '../config/client';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

const allowedTeams = ['Alpha', 'Beta', 'Gamma']; // ✅ Strict team list

// ✅ 1. Admin Creates User (with team validation)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, team } = req.body;

    if (!name || !email || !password || !role || !team) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (!allowedTeams.includes(team)) {
      res.status(400).json({ message: 'Team must be Alpha, Beta, or Gamma' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, team },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        team: user.team,
      },
    });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// ✅ 2. Admin Dashboard - Team Budgets + Approved Expenses
export const getAdminDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentMonth = dayjs().format('MMMM YYYY');

    // ✅ Get budgets ONLY for Alpha, Beta, Gamma teams
    const budgets = await prisma.budget.findMany({
      where: {
        month: currentMonth,
        team: { in: allowedTeams },
      },
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

    // ✅ Also fetch approved expenses for Admin table
    const allExpenses = await prisma.expense.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        category: true,
        amount: true,
        notes: true,
        status: true,
        createdAt: true,
        employee: {
          select: {
            name: true,
            team: true,
          },
        },
        receipt: true,
      },
    });

    res.status(200).json({ teamOverview, expenses: allExpenses });
  } catch (error) {
    console.error('❌ Admin Dashboard Error:', error);
    res.status(500).json({ message: 'Failed to load admin dashboard' });
  }
};
