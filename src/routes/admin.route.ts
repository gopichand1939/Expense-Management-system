import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { checkRole } from '../middleware/checkRole';
import { createUser, getAdminDashboard } from '../controllers/admin.controller';
import { setBudget } from '../controllers/budget.controller'; // ✅ import this

const router = Router();

router.post('/create-user', verifyToken, checkRole(['ADMIN']), createUser);
router.get('/dashboard', verifyToken, checkRole(['ADMIN']), getAdminDashboard);
router.post('/set-budget', verifyToken, checkRole(['ADMIN']), setBudget); // ✅ this line added correctly

export default router;
