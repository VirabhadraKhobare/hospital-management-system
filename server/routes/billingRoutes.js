import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createBilling,
  deleteBilling,
  getBillingById,
  getBillings,
  updateBilling
} from '../controllers/billingController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorizeRole(['admin', 'receptionist']), getBillings);

router.post(
  '/',
  authorizeRole(['admin', 'receptionist']),
  [
    body('patientId').isMongoId().withMessage('Valid patient id is required'),
    body('doctorId').isMongoId().withMessage('Valid doctor id is required'),
    body('services').isArray().withMessage('Services must be an array'),
    body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be positive')
  ],
  validateRequest,
  createBilling
);

router.get(
  '/:id',
  authorizeRole(['admin', 'receptionist']),
  [param('id').isMongoId().withMessage('Invalid billing id')],
  validateRequest,
  getBillingById
);

router.put(
  '/:id',
  authorizeRole(['admin', 'receptionist']),
  [
    param('id').isMongoId().withMessage('Invalid billing id'),
    body('totalAmount').optional().isFloat({ min: 0 }).withMessage('Total amount must be positive')
  ],
  validateRequest,
  updateBilling
);

router.delete(
  '/:id',
  authorizeRole(['admin']),
  [param('id').isMongoId().withMessage('Invalid billing id')],
  validateRequest,
  deleteBilling
);

export default router;
