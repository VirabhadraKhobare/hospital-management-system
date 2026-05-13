import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import connectDB from './config/db.js';
import User from './models/User.js';
import Patient from './models/Patient.js';
import Doctor from './models/Doctor.js';
import Appointment from './models/Appointment.js';
import Billing from './models/Billing.js';
import Service from './models/Service.js';
import Laboratory from './models/Laboratory.js';
import Pharmacy from './models/Pharmacy.js';
import Department from './models/Department.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Patient.deleteMany({}),
      Doctor.deleteMany({}),
      Appointment.deleteMany({}),
      Billing.deleteMany({}),
      Service.deleteMany({}),
      Laboratory.deleteMany({}),
      Pharmacy.deleteMany({}),
      Department.deleteMany({})
    ]);

    const hashedPassword = await bcrypt.hash('Password@123', 12);

    const users = await User.insertMany([
      { name: 'System Admin', email: 'admin@hms.com', password: hashedPassword, role: 'admin', mobile: '9999999990' },
      { name: 'Front Desk', email: 'reception@hms.com', password: hashedPassword, role: 'receptionist', mobile: '9999999991' },
      { name: 'Main Pharmacist', email: 'pharmacy@hms.com', password: hashedPassword, role: 'pharmacist', mobile: '9999999992' }
    ]);

    const departments = await Department.insertMany([
      { name: 'Cardiology', description: 'Heart and vascular care' },
      { name: 'Neurology', description: 'Brain and nerve care' }
    ]);

    const doctors = await Doctor.insertMany([
      {
        name: 'Dr. Aditi Mehra',
        specialization: 'Cardiologist',
        mobile: '9000000001',
        email: 'aditi.doctor@hms.com',
        qualification: 'MD',
        experience: 10,
        availableTiming: '10:00 AM - 2:00 PM',
        department: departments[0]._id
      },
      {
        name: 'Dr. Rohan Sen',
        specialization: 'Neurologist',
        mobile: '9000000002',
        email: 'rohan.doctor@hms.com',
        qualification: 'DM',
        experience: 8,
        availableTiming: '2:00 PM - 6:00 PM',
        department: departments[1]._id
      }
    ]);

    departments[0].headDoctor = doctors[0]._id;
    departments[1].headDoctor = doctors[1]._id;
    await Promise.all([departments[0].save(), departments[1].save()]);

    const patients = await Patient.insertMany([
      {
        name: 'Rahul Verma',
        mobile: '8000000001',
        email: 'rahul.patient@hms.com',
        address: 'Bengaluru',
        age: 34,
        gender: 'male',
        bloodGroup: 'O+',
        disease: 'Hypertension',
        password: hashedPassword
      },
      {
        name: 'Sneha Iyer',
        mobile: '8000000002',
        email: 'sneha.patient@hms.com',
        address: 'Mumbai',
        age: 29,
        gender: 'female',
        bloodGroup: 'A+',
        disease: 'Migraine',
        password: hashedPassword
      }
    ]);

    const services = await Service.insertMany([
      { name: 'General Consultation', amount: 600, description: 'Standard doctor consultation', department: departments[0]._id },
      { name: 'MRI Scan', amount: 3500, description: 'Magnetic resonance imaging', department: departments[1]._id }
    ]);

    const appointments = await Appointment.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        date: new Date(),
        time: '11:30 AM',
        appointmentDate: new Date(),
        status: 'scheduled',
        notes: 'First-time consultation'
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        date: new Date(),
        time: '3:00 PM',
        appointmentDate: new Date(),
        status: 'scheduled'
      }
    ]);

    await Billing.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        services: [{ serviceId: services[0]._id, name: services[0].name, amount: services[0].amount, quantity: 1 }],
        totalAmount: 600,
        paymentType: 'card',
        paymentStatus: 'paid',
        discount: 0
      }
    ]);

    await Laboratory.insertMany([
      {
        testName: 'Lipid Profile',
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        result: 'Borderline high cholesterol',
        reportFile: '/reports/lipid-profile-rahul.pdf',
        testDate: new Date(),
        status: 'completed'
      }
    ]);

    await Pharmacy.insertMany([
      {
        medicineName: 'Atorvastatin 10mg',
        genericName: 'Atorvastatin',
        quantity: 120,
        price: 25,
        expiryDate: new Date('2027-12-31'),
        supplier: 'MediSupply Pvt Ltd',
        category: 'Cardiology'
      },
      {
        medicineName: 'Sumatriptan 50mg',
        genericName: 'Sumatriptan',
        quantity: 40,
        price: 45,
        expiryDate: new Date('2027-08-15'),
        supplier: 'NeuroPharm',
        category: 'Neurology'
      }
    ]);

    console.log('Seed data inserted successfully.');
    console.log('Login with: admin@hms.com / Password@123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
