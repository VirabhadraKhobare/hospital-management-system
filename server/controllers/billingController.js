import Billing from '../models/Billing.js';
import { createCrudController } from '../utils/crudControllerFactory.js';

const controller = createCrudController(Billing, {
  populate: 'patientId doctorId services.serviceId',
  searchFields: ['paymentStatus', 'paymentType']
});

export const createBilling = controller.create;
export const getBillings = controller.list;
export const getBillingById = controller.getById;
export const updateBilling = controller.update;
export const deleteBilling = controller.remove;
