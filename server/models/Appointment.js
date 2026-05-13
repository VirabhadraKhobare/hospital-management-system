import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  appointmentDate: {
    type: Date,
    index: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

appointmentSchema.pre('validate', function syncAppointmentDate(next) {
  if (this.date) {
    this.appointmentDate = this.date;
  }
  next();
});

appointmentSchema.index({ doctorId: 1, date: 1, time: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
