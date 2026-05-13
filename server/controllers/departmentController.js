import Department from '../models/Department.js';
import { createCrudController } from '../utils/crudControllerFactory.js';

const controller = createCrudController(Department, {
  populate: 'headDoctor',
  searchFields: ['name', 'description']
});

export const createDepartment = controller.create;
export const getDepartments = controller.list;
export const getDepartmentById = controller.getById;
export const updateDepartment = controller.update;
export const deleteDepartment = controller.remove;
