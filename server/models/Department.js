import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  headDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
