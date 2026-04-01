import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);
// VIEWER, ANALYST, ADMIN can view dashboards
router.get('/summary', requireRole(['VIEWER', 'ANALYST', 'ADMIN']), dashboardController.getSummary);

export default router;
