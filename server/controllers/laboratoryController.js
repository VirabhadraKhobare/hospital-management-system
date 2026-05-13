import Laboratory from '../models/Laboratory.js';
import { createCrudController } from '../utils/crudControllerFactory.js';

const controller = createCrudController(Laboratory, {
  populate: 'patientId doctorId',
  searchFields: ['testName', 'status', 'result']
});

export const createLaboratory = controller.create;
export const getLaboratories = controller.list;
export const getLaboratoryById = controller.getById;
export const updateLaboratory = controller.update;
export const deleteLaboratory = controller.remove;
