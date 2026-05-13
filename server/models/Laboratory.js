import mongoose from 'mongoose';

const laboratorySchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
    trim: true
  },
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
  result: {
    type: String,
    trim: true
  },
  reportFile: {
    type: String,
    trim: true
  },
  testDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'in_progress', 'completed'],
    default: 'requested'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Laboratory = mongoose.model('Laboratory', laboratorySchema);
export default Laboratory;
