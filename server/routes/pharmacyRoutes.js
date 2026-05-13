import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createPharmacy,
  deletePharmacy,
  getPharmacies,
  getPharmacyById,
  updatePharmacy
} from '../controllers/pharmacyController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorizeRole(['admin', 'pharmacist']), getPharmacies);

router.post(
  '/',
  authorizeRole(['admin', 'pharmacist']),
  [
    body('medicineName').trim().notEmpty().withMessage('Medicine name is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be non-negative'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
    body('expiryDate').isISO8601().withMessage('Valid expiry date is required')
  ],
  validateRequest,
  createPharmacy
);

router.get(
  '/:id',
  authorizeRole(['admin', 'pharmacist']),
  [param('id').isMongoId().withMessage('Invalid pharmacy id')],
  validateRequest,
  getPharmacyById
);

router.put(
  '/:id',
  authorizeRole(['admin', 'pharmacist']),
  [
    param('id').isMongoId().withMessage('Invalid pharmacy id'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be non-negative'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be non-negative')
  ],
  validateRequest,
  updatePharmacy
);

router.delete(
  '/:id',
  authorizeRole(['admin']),
  [param('id').isMongoId().withMessage('Invalid pharmacy id')],
  validateRequest,
  deletePharmacy
);

export default router;
