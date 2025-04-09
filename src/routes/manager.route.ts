import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { checkRole } from '../middleware/checkRole';
import {
  getPendingExpenses,
  updateExpenseStatus,
  getManagerDashboard
} from '../controllers/manager.controller';

const router = Router();

// ✅ Manager dashboard (returns full data)
router.get('/dashboard', verifyToken, checkRole(['MANAGER']), getManagerDashboard);

// ✅ GET: All pending expenses (Manager view)
router.get('/expenses', verifyToken, checkRole(['MANAGER']), getPendingExpenses);

// ✅ PATCH: Approve or reject an expense
router.patch('/expenses/:id', verifyToken, checkRole(['MANAGER']), updateExpenseStatus);

export default router;
