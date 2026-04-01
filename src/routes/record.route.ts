import { Router } from 'express';
import * as recordController from '../controllers/record.controller';
import { validateBody, validateQuery } from '../middlewares/validate.middleware';
import { createRecordSchema, updateRecordSchema, getRecordsQuerySchema } from '../validators/record.validator';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

// ANALYST and ADMIN can view records
router.get('/', requireRole(['ANALYST', 'ADMIN']), validateQuery(getRecordsQuerySchema), recordController.list);
router.get('/:id', requireRole(['ANALYST', 'ADMIN']), recordController.getOne);

// Only ADMIN can create, update, delete records
router.post('/', requireRole(['ADMIN']), validateBody(createRecordSchema), recordController.create);
router.put('/:id', requireRole(['ADMIN']), validateBody(updateRecordSchema), recordController.update);
router.delete('/:id', requireRole(['ADMIN']), recordController.remove);

export default router;
