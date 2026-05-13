export const ROLE_NAV = {
  admin: ['dashboard', 'patients', 'doctors', 'appointments', 'billing', 'services', 'laboratory', 'pharmacy', 'profile'],
  receptionist: ['dashboard', 'patients', 'doctors', 'appointments', 'billing', 'laboratory', 'profile'],
  doctor: ['dashboard', 'doctors', 'appointments', 'laboratory', 'profile'],
  pharmacist: ['dashboard', 'pharmacy', 'profile'],
  patient: ['profile']
};

export const APPOINTMENT_STATUS = ['scheduled', 'completed', 'cancelled', 'rescheduled'];
