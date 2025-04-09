// ✅ FILE: src/controllers/expense.controller.ts

import { Request, Response } from 'express';
import { prisma } from '../config/client';
import { sendEmail } from '../services/email.service';

export const submitExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, category, project, date, notes } = req.body;
    const employeeId = (req as any).user.id;

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        category,
        project,
        date: new Date(date),
        notes,
        receipt: req.file ? req.file.filename : null,
        employeeId,
      },
      include: {
        employee: { select: { email: true, name: true } },
      },
    });

    // ✅ Send email notification
    await sendEmail(
      expense.employee.email,
      'Expense Submitted',
      `Hello ${expense.employee.name},\n\nYour expense of ₹${amount} for ${category} has been submitted and is pending manager approval.`
    );

    // ✅ Create in-app notification
    await prisma.notification.create({
      data: {
        userId: employeeId,
        message: `Your expense for ₹${amount} has been submitted.`,
        type: 'EXPENSE_SUBMITTED',
      },
    });

    res.status(201).json({ message: 'Expense submitted successfully', expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Expense submission failed' });
  }
};
