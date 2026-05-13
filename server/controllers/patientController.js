import Patient from '../models/Patient.js';
import { createCrudController } from '../utils/crudControllerFactory.js';

const controller = createCrudController(Patient, {
  searchFields: ['name', 'email', 'mobile', 'disease']
});

export const createPatient = controller.create;
export const getPatients = controller.list;
export const getPatientById = controller.getById;
export const updatePatient = controller.update;
export const deletePatient = controller.remove;
