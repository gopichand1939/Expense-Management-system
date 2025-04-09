import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { checkRole } from '../middleware/checkRole';
import { getTeamDashboard, getChartData } from '../controllers/dashboard/dashboard.controller';

const router = Router();

// ✅ ADMIN + MANAGER access
router.get('/team-budget', verifyToken, checkRole(['ADMIN', 'MANAGER']), getTeamDashboard);
router.get('/charts', verifyToken, checkRole(['ADMIN', 'MANAGER']), getChartData);

export default router;
