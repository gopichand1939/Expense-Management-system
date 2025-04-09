import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';
import { auditLogger } from '../middleware/logger'; // ✅ Required for logging

const router = Router();

// ✅ Use auditLogger in routes
router.post('/signup', auditLogger('User Signup'), signup);
router.post('/login', auditLogger('User Login'), login);

export default router;
