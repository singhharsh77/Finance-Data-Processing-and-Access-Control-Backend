import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import recordRoutes from './record.route';
import dashboardRoutes from './dashboard.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/records', recordRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
