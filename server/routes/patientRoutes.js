import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createPatient,
  deletePatient,
  getPatientById,
  getPatients,
  updatePatient
} from '../controllers/patientController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorizeRole(['admin', 'receptionist']), getPatients);

router.post(
  '/',
  authorizeRole(['admin', 'receptionist']),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('mobile').trim().notEmpty().withMessage('Mobile is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  validateRequest,
  createPatient
);

router.get(
  '/:id',
  authorizeRole(['admin', 'receptionist', 'doctor']),
  [param('id').isMongoId().withMessage('Invalid patient id')],
  validateRequest,
  getPatientById
);

router.put(
  '/:id',
  authorizeRole(['admin', 'receptionist']),
  [
    param('id').isMongoId().withMessage('Invalid patient id'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('age').optional().isInt({ min: 0, max: 120 }).withMessage('Age must be between 0 and 120')
  ],
  validateRequest,
  updatePatient
);

router.delete(
  '/:id',
  authorizeRole(['admin', 'receptionist']),
  [param('id').isMongoId().withMessage('Invalid patient id')],
  validateRequest,
  deletePatient
);

export default router;
