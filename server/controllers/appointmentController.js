import Appointment from '../models/Appointment.js';
import { createCrudController } from '../utils/crudControllerFactory.js';

const controller = createCrudController(Appointment, {
  populate: 'patientId doctorId',
  searchFields: ['status', 'time', 'notes']
});

export const createAppointment = controller.create;
export const getAppointments = controller.list;
export const getAppointmentById = controller.getById;
export const updateAppointment = controller.update;
export const deleteAppointment = controller.remove;
