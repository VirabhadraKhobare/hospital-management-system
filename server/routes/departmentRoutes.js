import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment
} from '../controllers/departmentController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorizeRole(['admin', 'receptionist', 'doctor']), getDepartments);

router.post(
  '/',
  authorizeRole(['admin']),
  [body('name').trim().notEmpty().withMessage('Department name is required')],
  validateRequest,
  createDepartment
);

router.get(
  '/:id',
  authorizeRole(['admin', 'receptionist', 'doctor']),
  [param('id').isMongoId().withMessage('Invalid department id')],
  validateRequest,
  getDepartmentById
);

router.put(
  '/:id',
  authorizeRole(['admin']),
  [param('id').isMongoId().withMessage('Invalid department id')],
  validateRequest,
  updateDepartment
);

router.delete(
  '/:id',
  authorizeRole(['admin']),
  [param('id').isMongoId().withMessage('Invalid department id')],
  validateRequest,
  deleteDepartment
);

export default router;
