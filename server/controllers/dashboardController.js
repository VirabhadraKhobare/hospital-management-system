import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Billing from '../models/Billing.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [patients, doctors, appointments, revenueAgg, recentAppointments] = await Promise.all([
      Patient.countDocuments({ isActive: true }),
      Doctor.countDocuments({ isActive: true }),
      Appointment.countDocuments({ isActive: true }),
      Billing.aggregate([
        { $match: { isActive: true, paymentStatus: { $in: ['paid', 'partial'] } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalBills: { $sum: 1 }
          }
        }
      ]),
      Appointment.find({ isActive: true })
        .populate('patientId', 'name')
        .populate('doctorId', 'name specialization')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    return res.json({
      totals: {
        patients,
        doctors,
        appointments,
        revenue: revenueAgg[0]?.totalRevenue || 0,
        bills: revenueAgg[0]?.totalBills || 0
      },
      recentActivity: recentAppointments
    });
  } catch (error) {
    return next(error);
  }
};
