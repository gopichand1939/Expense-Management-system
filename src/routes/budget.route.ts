// ✅ Import core Express and middleware
import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { checkRole } from '../middleware/checkRole';

// ✅ Import all budget controllers
import {
  setBudget,
  getBudgets,
  getTeamBudgetStatus,
} from '../controllers/budget.controller';

// ✅ Initialize the router
const router = Router();

// ✅ POST /budget/set → Admin sets budget
router.post('/set', verifyToken, checkRole(['ADMIN']), setBudget);

// ✅ GET /budget/all → Admin fetches all budgets
router.get('/all', verifyToken, checkRole(['ADMIN']), getBudgets);

// ✅ GET /budget/status?team=Engineering&month=April 2025 → Admin/Manager checks team’s status
router.get('/status', verifyToken, checkRole(['ADMIN', 'MANAGER']), getTeamBudgetStatus);

// ✅ Export the budget router
export default router;
