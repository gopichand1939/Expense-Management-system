import { Router } from 'express';
import { submitExpense } from '../controllers/expense.controller';
import { upload } from '../utils/upload';
import { verifyToken } from '../middleware/verifyToken';
import { checkRole } from '../middleware/checkRole';
import { auditLogger } from '../middleware/logger'; // ✅ ADD THIS LINE

const router = Router();

router.post(
  '/submit',
  verifyToken,
  checkRole(['EMPLOYEE']),
  upload.single('receipt'),
  auditLogger('Expense Submission'), // ✅ Log expense submission
  submitExpense
);

export default router;
