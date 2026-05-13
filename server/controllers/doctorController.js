import Doctor from '../models/Doctor.js';
import { createCrudController } from '../utils/crudControllerFactory.js';

const controller = createCrudController(Doctor, {
  populate: 'department',
  searchFields: ['name', 'email', 'specialization']
});

export const createDoctor = controller.create;
export const getDoctors = controller.list;
export const getDoctorById = controller.getById;
export const updateDoctor = controller.update;
export const deleteDoctor = controller.remove;
