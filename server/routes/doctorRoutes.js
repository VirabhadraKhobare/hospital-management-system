import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createDoctor,
  deleteDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor
} from '../controllers/doctorController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorizeRole(['admin', 'receptionist', 'doctor']), getDoctors);

router.post(
  '/',
  authorizeRole(['admin', 'receptionist']),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('specialization').trim().notEmpty().withMessage('Specialization is required'),
    body('mobile').trim().notEmpty().withMessage('Mobile is required'),
    body('email').isEmail().withMessage('Valid email is required')
  ],
  validateRequest,
  createDoctor
);

router.get(
  '/:id',
  authorizeRole(['admin', 'receptionist', 'doctor']),
  [param('id').isMongoId().withMessage('Invalid doctor id')],
  validateRequest,
  getDoctorById
);

router.put(
  '/:id',
  authorizeRole(['admin', 'receptionist']),
  [
    param('id').isMongoId().withMessage('Invalid doctor id'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('experience').optional().isInt({ min: 0 }).withMessage('Experience cannot be negative')
  ],
  validateRequest,
  updateDoctor
);

router.delete(
  '/:id',
  authorizeRole(['admin']),
  [param('id').isMongoId().withMessage('Invalid doctor id')],
  validateRequest,
  deleteDoctor
);

export default router;
