import Service from '../models/Service.js';
import { createCrudController } from '../utils/crudControllerFactory.js';

const controller = createCrudController(Service, {
  populate: 'department',
  searchFields: ['name', 'description']
});

export const createService = controller.create;
export const getServices = controller.list;
export const getServiceById = controller.getById;
export const updateService = controller.update;
export const deleteService = controller.remove;
