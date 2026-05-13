import Pharmacy from '../models/Pharmacy.js';
import { createCrudController } from '../utils/crudControllerFactory.js';

const controller = createCrudController(Pharmacy, {
  searchFields: ['medicineName', 'genericName', 'supplier', 'category']
});

export const createPharmacy = controller.create;
export const getPharmacies = controller.list;
export const getPharmacyById = controller.getById;
export const updatePharmacy = controller.update;
export const deletePharmacy = controller.remove;
