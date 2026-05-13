import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointment
} from '../controllers/appointmentController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorizeRole(['admin', 'receptionist', 'doctor']), getAppointments);

router.post(
  '/',
  authorizeRole(['admin', 'receptionist']),
  [
    body('patientId').isMongoId().withMessage('Valid patient id is required'),
    body('doctorId').isMongoId().withMessage('Valid doctor id is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').trim().notEmpty().withMessage('Time is required')
  ],
  validateRequest,
  createAppointment
);

router.get(
  '/:id',
  authorizeRole(['admin', 'receptionist', 'doctor']),
  [param('id').isMongoId().withMessage('Invalid appointment id')],
  validateRequest,
  getAppointmentById
);

router.put(
  '/:id',
  authorizeRole(['admin', 'receptionist', 'doctor']),
  [
    param('id').isMongoId().withMessage('Invalid appointment id'),
    body('patientId').optional().isMongoId().withMessage('Valid patient id is required'),
    body('doctorId').optional().isMongoId().withMessage('Valid doctor id is required'),
    body('date').optional().isISO8601().withMessage('Valid date is required')
  ],
  validateRequest,
  updateAppointment
);

router.delete(
  '/:id',
  authorizeRole(['admin', 'receptionist']),
  [param('id').isMongoId().withMessage('Invalid appointment id')],
  validateRequest,
  deleteAppointment
);

export default router;
