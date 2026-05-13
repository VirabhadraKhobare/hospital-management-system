import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createLaboratory,
  deleteLaboratory,
  getLaboratories,
  getLaboratoryById,
  updateLaboratory
} from '../controllers/laboratoryController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorizeRole(['admin', 'doctor', 'receptionist']), getLaboratories);

router.post(
  '/',
  authorizeRole(['admin', 'doctor', 'receptionist']),
  [
    body('testName').trim().notEmpty().withMessage('Test name is required'),
    body('patientId').isMongoId().withMessage('Valid patient id is required'),
    body('doctorId').isMongoId().withMessage('Valid doctor id is required'),
    body('testDate').isISO8601().withMessage('Valid test date is required')
  ],
  validateRequest,
  createLaboratory
);

router.get(
  '/:id',
  authorizeRole(['admin', 'doctor', 'receptionist']),
  [param('id').isMongoId().withMessage('Invalid laboratory id')],
  validateRequest,
  getLaboratoryById
);

router.put(
  '/:id',
  authorizeRole(['admin', 'doctor']),
  [
    param('id').isMongoId().withMessage('Invalid laboratory id'),
    body('patientId').optional().isMongoId().withMessage('Valid patient id is required'),
    body('doctorId').optional().isMongoId().withMessage('Valid doctor id is required'),
    body('testDate').optional().isISO8601().withMessage('Valid test date is required')
  ],
  validateRequest,
  updateLaboratory
);

router.delete(
  '/:id',
  authorizeRole(['admin']),
  [param('id').isMongoId().withMessage('Invalid laboratory id')],
  validateRequest,
  deleteLaboratory
);

export default router;
