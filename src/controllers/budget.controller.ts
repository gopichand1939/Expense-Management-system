import { Request, Response } from 'express';
import { prisma } from '../config/client';
import dayjs from 'dayjs';

// ✅ Admin sets or updates team budget for current month
export const setBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    let { team, limit } = req.body;

    const month = dayjs().format('MMMM YYYY');

    // ✅ Normalize team name to proper case ("Alpha", "Beta", "Gamma")
    team = team?.trim();
    if (!team || typeof limit !== 'number') {
      res.status(400).json({ message: 'Team and valid limit are required' });
      return;
    }

    // Normalize the team name (e.g., "alpha" to "Alpha")
    team = team.charAt(0).toUpperCase() + team.slice(1).toLowerCase();

    // Check for valid team
    const allowedTeams = ['Alpha', 'Beta', 'Gamma'];
    if (!allowedTeams.includes(team)) {
      res.status(400).json({ message: 'Invalid team name. Must be Alpha, Beta, or Gamma' });
      return;
    }

    const existing = await prisma.budget.findFirst({
      where: { team, month },
    });

    if (existing) {
      await prisma.budget.update({
        where: { id: existing.id },
        data: { limit },
      });

      res.status(200).json({ message: 'Budget updated successfully' });
    } else {
      const created = await prisma.budget.create({
        data: {
          team,
          limit,
          month,
        },
      });

      res.status(201).json({ message: 'Budget set successfully', budget: created });
    }
  } catch (error) {
    console.error('❌ Failed to set budget:', error);
    res.status(500).json({ message: 'Failed to set budget' });
  }
};

// ✅ Get all budgets
export const getBudgets = async (req: Request, res: Response): Promise<void> => {
  try {
    const budgets = await prisma.budget.findMany();
    res.status(200).json({ budgets });
  } catch (error) {
    console.error('❌ Failed to fetch budgets:', error);
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
};

// ✅ Track Budget Usage by Team & Month
export const getTeamBudgetStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { team, month } = req.query;

    if (!team || !month) {
      res.status(400).json({ message: 'Team and month are required' });
      return;
    }

    // Normalize team name
    let normalizedTeam = String(team).trim();
    normalizedTeam = normalizedTeam.charAt(0).toUpperCase() + normalizedTeam.slice(1).toLowerCase(); // Normalize team name to "Alpha", "Beta", or "Gamma"

    const allowedTeams = ['Alpha', 'Beta', 'Gamma'];
    if (!allowedTeams.includes(normalizedTeam)) {
      res.status(400).json({ message: 'Invalid team name. Must be Alpha, Beta, or Gamma' });
      return;
    }

    const budget = await prisma.budget.findFirst({
      where: {
        team: normalizedTeam,
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

    const totalSpent = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        employee: { team: normalizedTeam },
        createdAt: {
          gte: start,
          lte: end,
        },
        status: 'APPROVED',
      },
    });

    const used = totalSpent._sum.amount || 0;
    const remaining = budget.limit - used;

    res.status(200).json({
      team: normalizedTeam,
      month,
      limit: budget.limit,
      used,
      remaining,
      isOverspent: remaining < 0,
    });
  } catch (error) {
    console.error('❌ Failed to calculate budget status:', error);
    res.status(500).json({ message: 'Failed to calculate budget status' });
  }
};
