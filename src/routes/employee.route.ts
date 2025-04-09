import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { checkRole } from '../middleware/checkRole';

const router = Router();

router.get('/dashboard', verifyToken, checkRole(['EMPLOYEE']), (req, res) => {
  res.json({ message: 'Welcome, Employee! Submit and view your expenses 💼' });
});

export default router;
