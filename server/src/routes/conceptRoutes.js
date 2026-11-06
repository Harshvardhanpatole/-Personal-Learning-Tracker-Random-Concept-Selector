import { Router } from 'express';
import { complete, deleteConcept } from '../controllers/conceptController.js';
import { authenticate } from '../middleware/auth.js';
import { uuidParam } from '../middleware/validate.js';

const router = Router();
router.use(authenticate);
router.delete('/:id', uuidParam('id'), deleteConcept);
router.post('/:id/complete', uuidParam('id'), complete);
export default router;
