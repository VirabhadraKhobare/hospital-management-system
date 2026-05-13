import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService
} from '../controllers/serviceController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorizeRole(['admin', 'receptionist']), getServices);

router.post(
  '/',
  authorizeRole(['admin']),
  [
    body('name').trim().notEmpty().withMessage('Service name is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive')
  ],
  validateRequest,
  createService
);

router.get(
  '/:id',
  authorizeRole(['admin', 'receptionist']),
  [param('id').isMongoId().withMessage('Invalid service id')],
  validateRequest,
  getServiceById
);

router.put(
  '/:id',
  authorizeRole(['admin']),
  [
    param('id').isMongoId().withMessage('Invalid service id'),
    body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be positive')
  ],
  validateRequest,
  updateService
);

router.delete(
  '/:id',
  authorizeRole(['admin']),
  [param('id').isMongoId().withMessage('Invalid service id')],
  validateRequest,
  deleteService
);

export default router;
