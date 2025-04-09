import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { checkRole } from '../middleware/checkRole';
import { createUser, getAdminDashboard } from '../controllers/admin.controller';

const router = Router();

router.post('/create-user', verifyToken, checkRole(['ADMIN']), createUser);
router.get('/dashboard', verifyToken, checkRole(['ADMIN']), getAdminDashboard);

export default router;
