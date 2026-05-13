import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', verifyToken, authorizeRole(['admin']), getDashboardStats);

export default router;
