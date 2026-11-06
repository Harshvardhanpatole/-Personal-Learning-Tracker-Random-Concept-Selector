import { Router } from 'express';
import { createProject, deleteProject, getProject, listProjects, updateProject } from '../controllers/projectController.js';
import { createConcept, listConcepts, spin } from '../controllers/conceptController.js';
import { authenticate } from '../middleware/auth.js';
import { uuidParam } from '../middleware/validate.js';

const router = Router();
router.use(authenticate);
router.get('/', listProjects);
router.post('/', createProject);
router.get('/:id', uuidParam('id'), getProject);
router.put('/:id', uuidParam('id'), updateProject);
router.delete('/:id', uuidParam('id'), deleteProject);
router.get('/:id/concepts', uuidParam('id'), listConcepts);
router.post('/:id/concepts', uuidParam('id'), createConcept);
router.post('/:id/spin', uuidParam('id'), spin);
export default router;
