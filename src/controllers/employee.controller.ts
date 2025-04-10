import { Request, Response } from 'express';
import { prisma } from '../config/client';

// ✅ Get all expenses submitted by the logged-in employee
export const getEmployeeExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const expenses = await prisma.expense.findMany({
      where: {
        employeeId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Error fetching employee expenses:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};
