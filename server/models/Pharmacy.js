import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  genericName: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  supplier: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);
export default Pharmacy;
