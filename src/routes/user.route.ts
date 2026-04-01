import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { updateUserStatusSchema } from '../validators/user.validator';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Only ADMIN can manage users
router.use(requireAuth);
router.use(requireRole(['ADMIN']));

router.get('/', userController.getUsers);
router.put('/:id/status', validateBody(updateUserStatusSchema), userController.updateUser);

export default router;
