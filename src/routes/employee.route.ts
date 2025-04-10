import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { checkRole } from '../middleware/checkRole';
import { getEmployeeExpenses } from '../controllers/employee.controller';

const router = Router();

router.get('/dashboard', verifyToken, checkRole(['EMPLOYEE']), (req, res) => {
  res.json({ message: 'Welcome, Employee! Submit and view your expenses 💼' });
});

router.get('/my-expenses', verifyToken, checkRole(['EMPLOYEE']), getEmployeeExpenses);

export default router;
