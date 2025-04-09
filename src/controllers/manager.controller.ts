import { Request, Response } from 'express';
import { prisma } from '../config/client';
import { sendEmail } from '../services/email.service';
import dayjs from 'dayjs';

// ✅ Get all PENDING expenses submitted by employees
export const getPendingExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { status: 'PENDING' },
      include: {
        employee: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch pending expenses' });
  }
};

// ✅ Manager updates expense status (approve/reject)
export const updateExpenseStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        res.status(400).json({ message: 'Invalid status. Must be APPROVED or REJECTED' });
        return;
      }
      

    const expense = await prisma.expense.update({
      where: { id },
      data: { status },
      include: {
        employee: { select: { id: true, email: true, name: true } },
      },
    });

    const message =
      status === 'APPROVED'
        ? `Your expense of ₹${expense.amount} has been approved ✅`
        : `Your expense of ₹${expense.amount} has been rejected ❌`;

    // ✅ Send email
    await sendEmail(expense.employee.email, `Expense ${status}`, message);

    // ✅ Create in-app notification
    await prisma.notification.create({
      data: {
        userId: expense.employee.id,
        message: `Your expense for ₹${expense.amount} was ${status.toLowerCase()}.`,
        type: `EXPENSE_${status}`,
      },
    });

    res.status(200).json({
      message: `Expense ${status.toLowerCase()} successfully`,
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update expense status' });
  }
};

// ✅ Manager dashboard with teamOverview & pending expenses
export const getManagerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const team = (req as any).user.team;

    const currentMonth = dayjs().format('MMMM YYYY');
    const [monthName, year] = currentMonth.split(' ');
    const start = dayjs(`01 ${monthName} ${year}`).startOf('month').toDate();
    const end = dayjs(start).endOf('month').toDate();

    const budget = await prisma.budget.findFirst({
      where: { team, month: currentMonth },
    });

    const approvedExpenses = await prisma.expense.findMany({
      where: {
        employee: { team },
        createdAt: { gte: start, lte: end },
        status: 'APPROVED',
      },
    });

    const pendingExpenses = await prisma.expense.findMany({
      where: {
        employee: { team },
        status: 'PENDING',
      },
      include: {
        employee: {
          select: { name: true, email: true },
        },
      },
    });

    const used = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = (budget?.limit || 0) - used;

    res.status(200).json({
      teamOverview: {
        team,
        month: currentMonth,
        limit: budget?.limit || 0,
        used,
        remaining,
        isOverspent: remaining < 0,
      },
      expenses: pendingExpenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load manager dashboard' });
  }
};
