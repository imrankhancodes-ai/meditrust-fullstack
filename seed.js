import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./server/models/userModel.js";
import Pathologist from "./server/models/pathologistModel.js";
import Doctor from "./server/models/doctorModel.js";
import Product from "./server/models/productModel.js";
import PathologyTest from "./server/models/pathologyTest.js";



dotenv.config();


// =====================================================
// USERS
// =====================================================

const users = [
    // =========================
    // PATIENTS / USERS
    // =========================

    {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "9876543210",
        password: "Password@123",
        age: 24,
        gender: "male",
        address: "Vijay Nagar, Indore",
        userType: "USER",
        isActive: true
    },

    {
        name: "Priya Verma",
        email: "priya@example.com",
        phone: "9876543211",
        password: "Password@123",
        age: 27,
        gender: "female",
        address: "Palasia, Indore",
        userType: "USER",
        isActive: true
    },

    {
        name: "Aman Jain",
        email: "aman@example.com",
        phone: "9876543212",
        password: "Password@123",
        age: 31,
        gender: "male",
        address: "Bhawarkua, Indore",
        userType: "USER",
        isActive: true
    },

    {
        name: "Sneha Patel",
        email: "sneha@example.com",
        phone: "9876543213",
        password: "Password@123",
        age: 22,
        gender: "female",
        address: "Rau, Indore",
        userType: "USER",
        isActive: true
    },


    // =========================
    // DOCTORS
    // =========================

    {
        name: "Dr. Amit Verma",
        email: "amit.doctor@example.com",
        phone: "9876543220",
        password: "Doctor@123",
        age: 42,
        gender: "male",
        address: "Vijay Nagar, Indore",
        userType: "DOCTOR",
        isActive: true
    },

    {
        name: "Dr. Neha Sharma",
        email: "neha.doctor@example.com",
        phone: "9876543221",
        password: "Doctor@123",
        age: 38,
        gender: "female",
        address: "Scheme No. 54, Indore",
        userType: "DOCTOR",
        isActive: true
    },

    {
        name: "Dr. Rajesh Khanna",
        email: "rajesh.doctor@example.com",
        phone: "9876543222",
        password: "Doctor@123",
        age: 51,
        gender: "male",
        address: "AB Road, Indore",
        userType: "DOCTOR",
        isActive: true
    },

    {
        name: "Dr. Kavita Iyer",
        email: "kavita.doctor@example.com",
        phone: "9876543223",
        password: "Doctor@123",
        age: 35,
        gender: "female",
        address: "South Tukoganj, Indore",
        userType: "DOCTOR",
        isActive: true
    },

    {
        name: "Dr. Sanjay Mehta",
        email: "sanjay.doctor@example.com",
        phone: "9876543224",
        password: "Doctor@123",
        age: 47,
        gender: "male",
        address: "Sapphire Heights, Indore",
        userType: "DOCTOR",
        isActive: true
    },

    {
        name: "Dr. Ayesha Siddiqui",
        email: "ayesha.doctor@example.com",
        phone: "9876543225",
        password: "Doctor@123",
        age: 33,
        gender: "female",
        address: "Khajrana, Indore",
        userType: "DOCTOR",
        isActive: true
    },

    {
        name: "Dr. Vikram Solanki",
        email: "vikram.doctor@example.com",
        phone: "9876543226",
        password: "Doctor@123",
        age: 40,
        gender: "male",
        address: "Geeta Bhawan, Indore",
        userType: "DOCTOR",
        isActive: true
    },

    {
        name: "Dr. Pooja Nair",
        email: "pooja.doctor@example.com",
        phone: "9876543227",
        password: "Doctor@123",
        age: 37,
        gender: "female",
        address: "New Palasia, Indore",
        userType: "DOCTOR",
        isActive: true
    },

    {
        name: "Dr. Rohan Deshmukh",
        email: "rohan.doctor@example.com",
        phone: "9876543228",
        password: "Doctor@123",
        age: 31,
        gender: "male",
        address: "Manoramaganj, Indore",
        userType: "DOCTOR",
        isActive: true
    },

    {
        name: "Dr. Meera Kulkarni",
        email: "meera.doctor@example.com",
        phone: "9876543229",
        password: "Doctor@123",
        age: 44,
        gender: "female",
        address: "Race Course Road, Indore",
        userType: "DOCTOR",
        isActive: true
    },


    // =========================
    // PATHOLOGISTS
    // =========================

    {
        name: "Dr. Anjali Mehta",
        email: "anjali.path@example.com",
        phone: "9876543230",
        password: "Path@123",
        age: 36,
        gender: "female",
        address: "MG Road, Indore",
        userType: "PATHOLOGIST",
        isActive: true
    },

    {
        name: "Dr. Vikram Singh",
        email: "vikram.path@example.com",
        phone: "9876543231",
        password: "Path@123",
        age: 44,
        gender: "male",
        address: "Rau, Indore",
        userType: "PATHOLOGIST",
        isActive: true
    },

    {
        name: "Dr. Nisha Rao",
        email: "nisha.path@example.com",
        phone: "9876543232",
        password: "Path@123",
        age: 39,
        gender: "female",
        address: "LIG Square, Indore",
        userType: "PATHOLOGIST",
        isActive: true
    },

    {
        name: "Dr. Arjun Patidar",
        email: "arjun.path@example.com",
        phone: "9876543233",
        password: "Path@123",
        age: 42,
        gender: "male",
        address: "Tilak Nagar, Indore",
        userType: "PATHOLOGIST",
        isActive: true
    },

    {
        name: "Dr. Farhan Qureshi",
        email: "farhan.path@example.com",
        phone: "9876543234",
        password: "Path@123",
        age: 35,
        gender: "male",
        address: "Sarafa, Indore",
        userType: "PATHOLOGIST",
        isActive: true
    },


    // =========================
    // ADMIN
    // =========================

    {
        name: "Super Admin",
        email: "admin@example.com",
        phone: "9876543240",
        password: "Admin@123",
        age: 35,
        gender: "male",
        address: "Indore, Madhya Pradesh",
        userType: "ADMIN",
        isActive: true
    }
];


// =====================================================
// DOCTOR PROFILES
// =====================================================

const doctorProfiles = [
    {
        email: "amit.doctor@example.com",
        clinicName: "Verma General Clinic",
        address: "Vijay Nagar, Indore",
        qualification: "MBBS, MD (Medicine)",
        registrationNumber: "MP/MED/2012/10421",
        experience: 14,
        specialization: ["General Physician"],
        phone: "9876543220",
        consultationFee: 400,
        workingHours: { start: "10:00", end: "14:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "neha.doctor@example.com",
        clinicName: "Sharma Women's Care",
        address: "Scheme No. 54, Indore",
        qualification: "MBBS, MS (OBG)",
        registrationNumber: "MP/MED/2014/20877",
        experience: 11,
        specialization: ["Gynecologist"],
        phone: "9876543221",
        consultationFee: 600,
        workingHours: { start: "11:00", end: "19:00" },
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "rajesh.doctor@example.com",
        clinicName: "Khanna Heart Care",
        address: "AB Road, Indore",
        qualification: "MBBS, MD, DM (Cardiology)",
        registrationNumber: "MP/MED/2005/09112",
        experience: 21,
        specialization: ["Cardiologist"],
        phone: "9876543222",
        consultationFee: 900,
        workingHours: { start: "09:00", end: "13:00" },
        availableDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "kavita.doctor@example.com",
        clinicName: "Little Smiles Clinic",
        address: "South Tukoganj, Indore",
        qualification: "MBBS, MD (Pediatrics)",
        registrationNumber: "MP/MED/2016/31209",
        experience: 9,
        specialization: ["Pediatrician"],
        phone: "9876543223",
        consultationFee: 500,
        workingHours: { start: "10:00", end: "20:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "sanjay.doctor@example.com",
        clinicName: "Mehta Bone & Joint Centre",
        address: "Sapphire Heights, Indore",
        qualification: "MBBS, MS (Ortho)",
        registrationNumber: "MP/MED/2009/15430",
        experience: 16,
        specialization: ["Orthopedic Surgeon"],
        phone: "9876543224",
        consultationFee: 700,
        workingHours: { start: "17:00", end: "21:00" },
        availableDays: ["Monday", "Wednesday", "Thursday", "Saturday", "Sunday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "ayesha.doctor@example.com",
        clinicName: "Glow Skin Clinic",
        address: "Khajrana, Indore",
        qualification: "MBBS, MD (Dermatology)",
        registrationNumber: "MP/MED/2018/42755",
        experience: 7,
        specialization: ["Dermatologist"],
        phone: "9876543225",
        consultationFee: 650,
        workingHours: { start: "12:00", end: "20:00" },
        availableDays: ["Tuesday", "Wednesday", "Friday", "Saturday", "Sunday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "vikram.doctor@example.com",
        clinicName: "Solanki ENT Care",
        address: "Geeta Bhawan, Indore",
        qualification: "MBBS, MS (ENT)",
        registrationNumber: "MP/MED/2013/19802",
        experience: 12,
        specialization: ["ENT Specialist"],
        phone: "9876543226",
        consultationFee: 550,
        workingHours: { start: "10:00", end: "18:00" },
        availableDays: ["Monday", "Tuesday", "Friday", "Saturday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "pooja.doctor@example.com",
        clinicName: "MindWell Clinic",
        address: "New Palasia, Indore",
        qualification: "MBBS, MD (Psychiatry)",
        registrationNumber: "MP/MED/2015/27641",
        experience: 10,
        specialization: ["Psychiatrist"],
        phone: "9876543227",
        consultationFee: 800,
        workingHours: { start: "14:00", end: "20:00" },
        availableDays: ["Monday", "Thursday", "Friday", "Sunday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "rohan.doctor@example.com",
        clinicName: "Bright Smile Dental",
        address: "Manoramaganj, Indore",
        qualification: "BDS, MDS",
        registrationNumber: "MP/MED/2019/51038",
        experience: 6,
        specialization: ["Dentist"],
        phone: "9876543228",
        consultationFee: 450,
        workingHours: { start: "10:00", end: "21:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "meera.doctor@example.com",
        clinicName: "Kulkarni Eye Hospital",
        address: "Race Course Road, Indore",
        qualification: "MBBS, MS (Ophthalmology)",
        registrationNumber: "MP/MED/2010/14366",
        experience: 15,
        specialization: ["Ophthalmologist"],
        phone: "9876543229",
        consultationFee: 500,
        workingHours: { start: "09:00", end: "17:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
        isVerified: true,
        isActive: true
    }
];


// =====================================================
// PATHOLOGIST PROFILES (fictional lab names)
// =====================================================

const pathologistProfiles = [
    {
        email: "anjali.path@example.com",
        laboratoryName: "Indore Diagnostic Centre",
        laboratoryAddress: "MG Road, Indore",
        qualification: "MD Pathology",
        registrationNumber: "MP-PATH-10234",
        experience: 8,
        specialization: ["Clinical Pathology", "Hematology", "Biochemistry"],
        phone: "9876543230",
        consultationFee: 500,
        workingHours: { start: "09:00", end: "18:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "vikram.path@example.com",
        laboratoryName: "CityCare Pathology Lab",
        laboratoryAddress: "Rau, Indore",
        qualification: "MD Pathology",
        registrationNumber: "MP-PATH-10235",
        experience: 12,
        specialization: ["Histopathology", "Cytology", "Clinical Pathology"],
        phone: "9876543231",
        consultationFee: 700,
        workingHours: { start: "10:00", end: "19:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "nisha.path@example.com",
        laboratoryName: "Apex Diagnostics Indore",
        laboratoryAddress: "LIG Square, Indore",
        qualification: "MD Pathology, DNB",
        registrationNumber: "MP-PATH-10236",
        experience: 10,
        specialization: ["Biochemistry", "Immunology", "Clinical Pathology"],
        phone: "9876543232",
        consultationFee: 600,
        workingHours: { start: "08:00", end: "20:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "arjun.path@example.com",
        laboratoryName: "Precision Path Labs",
        laboratoryAddress: "Tilak Nagar, Indore",
        qualification: "MD Pathology",
        registrationNumber: "MP-PATH-10237",
        experience: 9,
        specialization: ["Hematology", "Molecular Pathology", "Cytology"],
        phone: "9876543233",
        consultationFee: 650,
        workingHours: { start: "09:00", end: "21:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"],
        isVerified: true,
        isActive: true
    },
    {
        email: "farhan.path@example.com",
        laboratoryName: "Wellness Diagnostics & Imaging",
        laboratoryAddress: "Sarafa, Indore",
        qualification: "MD Radiology, DMRD",
        registrationNumber: "MP-PATH-10238",
        experience: 7,
        specialization: ["Radiology", "Clinical Pathology", "Microbiology"],
        phone: "9876543234",
        consultationFee: 550,
        workingHours: { start: "10:00", end: "18:00" },
        availableDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
        isVerified: true,
        isActive: true
    }
];


// =====================================================
// PATHOLOGY TEST CATALOG (4-6 tests per lab)
// =====================================================

const pathologyTests = [
    // ---- Indore Diagnostic Centre ----
    { labEmail: "anjali.path@example.com", title: "Complete Blood Count (CBC)", description: "Hemoglobin, WBC, platelets and red-cell indices.", price: 300 },
    { labEmail: "anjali.path@example.com", title: "Lipid Profile", description: "Cholesterol, triglycerides, HDL, LDL and VLDL.", price: 600 },
    { labEmail: "anjali.path@example.com", title: "Thyroid Profile (T3, T4, TSH)", description: "Complete thyroid function panel.", price: 500 },
    { labEmail: "anjali.path@example.com", title: "Liver Function Test (LFT)", description: "Bilirubin, SGOT, SGPT, proteins and enzymes.", price: 700 },
    { labEmail: "anjali.path@example.com", title: "HbA1c", description: "Three-month average blood sugar marker.", price: 450 },
    { labEmail: "anjali.path@example.com", title: "Fasting Blood Sugar", description: "Glucose measured after overnight fasting.", price: 100 },

    // ---- CityCare Pathology Lab ----
    { labEmail: "vikram.path@example.com", title: "Complete Blood Count (CBC)", description: "Hemoglobin, WBC, platelets and red-cell indices.", price: 320 },
    { labEmail: "vikram.path@example.com", title: "Kidney Function Test (KFT)", description: "Creatinine, urea, uric acid and electrolytes.", price: 700 },
    { labEmail: "vikram.path@example.com", title: "Urine Routine & Microscopy", description: "Physical, chemical and microscopic urine analysis.", price: 200 },
    { labEmail: "vikram.path@example.com", title: "Vitamin D (25-OH)", description: "25-hydroxy vitamin D level.", price: 1200 },
    { labEmail: "vikram.path@example.com", title: "ECG", description: "12-lead resting electrocardiogram.", price: 250 },
    { labEmail: "vikram.path@example.com", title: "Dengue NS1 Antigen", description: "Early dengue infection screening.", price: 800 },

    // ---- Apex Diagnostics Indore ----
    { labEmail: "nisha.path@example.com", title: "Lipid Profile", description: "Cholesterol, triglycerides, HDL, LDL and VLDL.", price: 650 },
    { labEmail: "nisha.path@example.com", title: "HbA1c", description: "Three-month average blood sugar marker.", price: 470 },
    { labEmail: "nisha.path@example.com", title: "Post-Prandial Blood Sugar", description: "Glucose measured two hours after a meal.", price: 100 },
    { labEmail: "nisha.path@example.com", title: "CRP (C-Reactive Protein)", description: "Inflammation marker.", price: 500 },
    { labEmail: "nisha.path@example.com", title: "Chest X-Ray", description: "Digital chest radiograph with report.", price: 400 },

    // ---- Precision Path Labs ----
    { labEmail: "arjun.path@example.com", title: "Thyroid Profile (T3, T4, TSH)", description: "Complete thyroid function panel.", price: 520 },
    { labEmail: "arjun.path@example.com", title: "Vitamin B12", description: "Serum vitamin B12 level.", price: 900 },
    { labEmail: "arjun.path@example.com", title: "Liver Function Test (LFT)", description: "Bilirubin, SGOT, SGPT, proteins and enzymes.", price: 720 },
    { labEmail: "arjun.path@example.com", title: "Kidney Function Test (KFT)", description: "Creatinine, urea, uric acid and electrolytes.", price: 730 },
    { labEmail: "arjun.path@example.com", title: "Ultrasound Abdomen (USG)", description: "Whole-abdomen ultrasound with report.", price: 1000 },

    // ---- Wellness Diagnostics & Imaging ----
    { labEmail: "farhan.path@example.com", title: "Complete Blood Count (CBC)", description: "Hemoglobin, WBC, platelets and red-cell indices.", price: 280 },
    { labEmail: "farhan.path@example.com", title: "Fasting Blood Sugar", description: "Glucose measured after overnight fasting.", price: 90 },
    { labEmail: "farhan.path@example.com", title: "ECG", description: "12-lead resting electrocardiogram.", price: 240 },
    { labEmail: "farhan.path@example.com", title: "Chest X-Ray", description: "Digital chest radiograph with report.", price: 380 },
    { labEmail: "farhan.path@example.com", title: "Vitamin D (25-OH)", description: "25-hydroxy vitamin D level.", price: 1150 }
];


// =====================================================
// PRODUCTS
// =====================================================

const IMG_TABLET = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae";
const IMG_VITAMIN = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108";
const IMG_SYRUP = "https://images.unsplash.com/photo-1550572017-edd951b55104";
const IMG_CREAM = "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8";
const IMG_DEVICE_BP = "https://images.unsplash.com/photo-1559757175-0eb30cd8c063";
const IMG_DEVICE_THERMO = "https://images.unsplash.com/photo-1584634731339-252c581abfc5";
const IMG_FIRSTAID = "https://images.unsplash.com/photo-1603398938378-e54eab446dde";
const IMG_SANITIZER = "https://images.unsplash.com/photo-1584483766114-2cea6facdf57";

const products = [

    // =========================
    // ANALGESICS / ANTIPYRETICS (OTC)
    // =========================

    {
        name: "Paracetamol 650mg",
        description: "Fever and mild-to-moderate pain relief tablets, pack of 15.",
        price: 35,
        stock: 180,
        expiresOn: "2028-10-31",
        genericName: "Paracetamol",
        company: "Micro Labs",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Crocin 650mg",
        description: "Paracetamol 650mg tablets for fever and pain relief, pack of 15.",
        price: 42,
        stock: 150,
        expiresOn: "2028-09-30",
        genericName: "Paracetamol",
        company: "GSK",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Ibuprofen 400mg",
        description: "NSAID for pain, inflammation and fever, strip of 15 tablets.",
        price: 55,
        stock: 120,
        expiresOn: "2028-06-30",
        genericName: "Ibuprofen",
        company: "Abbott",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Diclofenac Sodium 50mg",
        description: "Effective relief for joint pain, sprains and backache, strip of 10.",
        price: 48,
        stock: 90,
        expiresOn: "2028-04-30",
        genericName: "Diclofenac Sodium",
        company: "Novartis",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Aspirin 75mg",
        description: "Low-dose aspirin for cardiac care as directed by a doctor, strip of 14.",
        price: 28,
        stock: 140,
        expiresOn: "2028-12-31",
        genericName: "Aspirin",
        company: "USV",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_TABLET,
        isActive: true
    },


    // =========================
    // ANTIBIOTICS (Rx only)
    // =========================

    {
        name: "Amoxicillin 500mg",
        description: "Broad-spectrum antibiotic for bacterial infections, strip of 10 capsules.",
        price: 95,
        stock: 80,
        expiresOn: "2027-11-30",
        genericName: "Amoxicillin",
        company: "Sun Pharma",
        category: "Capsule",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Azithromycin 500mg",
        description: "Macrolide antibiotic for respiratory and skin infections, strip of 5.",
        price: 110,
        stock: 6,
        expiresOn: "2027-08-31",
        genericName: "Azithromycin",
        company: "Alembic Pharmaceuticals",
        category: "Tablet",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Azee 500mg",
        description: "Azithromycin 500mg tablets for bacterial infections, strip of 5.",
        price: 125,
        stock: 60,
        expiresOn: "2027-10-31",
        genericName: "Azithromycin",
        company: "Cipla",
        category: "Tablet",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Ciprofloxacin 500mg",
        description: "Fluoroquinolone antibiotic for UTIs and GI infections, strip of 10.",
        price: 88,
        stock: 75,
        expiresOn: "2027-09-30",
        genericName: "Ciprofloxacin",
        company: "Ranbaxy",
        category: "Tablet",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Moxikind-CV 625mg",
        description: "Amoxicillin + clavulanic acid for resistant infections, strip of 10.",
        price: 195,
        stock: 55,
        expiresOn: "2027-12-31",
        genericName: "Amoxicillin + Clavulanic Acid",
        company: "Mankind Pharma",
        category: "Tablet",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },


    // =========================
    // GASTRO / ANTACIDS
    // =========================

    {
        name: "Omeprazole 20mg",
        description: "Proton-pump inhibitor for acidity and reflux, strip of 15 capsules.",
        price: 65,
        stock: 130,
        expiresOn: "2028-05-31",
        genericName: "Omeprazole",
        company: "Dr. Reddy's Laboratories",
        category: "Capsule",
        requiresPrescription: false,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Pantoprazole 40mg",
        description: "Once-daily relief for GERD and gastritis, strip of 15 tablets.",
        price: 120,
        stock: 110,
        expiresOn: "2028-03-31",
        genericName: "Pantoprazole",
        company: "Alkem Laboratories",
        category: "Tablet",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Domperidone 10mg",
        description: "For nausea, vomiting and indigestion, strip of 10 tablets.",
        price: 52,
        stock: 100,
        expiresOn: "2028-01-31",
        genericName: "Domperidone",
        company: "Torrent Pharmaceuticals",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Electral ORS Sachet",
        description: "WHO-formula oral rehydration salts, box of 5 sachets.",
        price: 45,
        stock: 300,
        expiresOn: "2027-09-30",
        genericName: "Oral Rehydration Salts",
        company: "FDC Limited",
        category: "Sachet",
        requiresPrescription: false,
        image: IMG_SYRUP,
        isActive: true
    },


    // =========================
    // ANTIHISTAMINES / ALLERGY (OTC)
    // =========================

    {
        name: "Cetirizine 10mg",
        description: "Daily allergy relief for cold, sneezing and itching, strip of 10.",
        price: 40,
        stock: 200,
        expiresOn: "2028-07-31",
        genericName: "Cetirizine",
        company: "GSK",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Levocetirizine 5mg",
        description: "Non-drowsy antihistamine for allergies and urticaria, strip of 10.",
        price: 58,
        stock: 160,
        expiresOn: "2028-02-28",
        genericName: "Levocetirizine",
        company: "Glenmark Pharmaceuticals",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_TABLET,
        isActive: true
    },


    // =========================
    // DIABETES / CARDIAC (Rx only)
    // =========================

    {
        name: "Metformin 500mg",
        description: "First-line therapy for type-2 diabetes, strip of 15 tablets.",
        price: 62,
        stock: 170,
        expiresOn: "2028-08-31",
        genericName: "Metformin",
        company: "USV Limited",
        category: "Tablet",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Glycomet 500mg",
        description: "Metformin 500mg for blood-sugar control, strip of 20 tablets.",
        price: 70,
        stock: 140,
        expiresOn: "2028-06-30",
        genericName: "Metformin",
        company: "USV Limited",
        category: "Tablet",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Amlodipine 5mg",
        description: "Calcium-channel blocker for blood pressure, strip of 15 tablets.",
        price: 48,
        stock: 150,
        expiresOn: "2028-11-30",
        genericName: "Amlodipine",
        company: "Cipla",
        category: "Tablet",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Telmisartan 40mg",
        description: "ARB for hypertension management, strip of 15 tablets.",
        price: 105,
        stock: 95,
        expiresOn: "2028-05-31",
        genericName: "Telmisartan",
        company: "Glenmark Pharmaceuticals",
        category: "Tablet",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },

    {
        name: "Atorvastatin 10mg",
        description: "Statin for cholesterol control, strip of 15 tablets.",
        price: 98,
        stock: 7,
        expiresOn: "2028-04-30",
        genericName: "Atorvastatin",
        company: "Sun Pharma",
        category: "Tablet",
        requiresPrescription: true,
        image: IMG_TABLET,
        isActive: true
    },


    // =========================
    // COUGH / COLD (OTC syrups)
    // =========================

    {
        name: "Chericof Syrup 100ml",
        description: "Dextromethorphan cough relief for dry cough, 100ml bottle.",
        price: 115,
        stock: 85,
        expiresOn: "2027-12-31",
        genericName: "Dextromethorphan",
        company: "Glenmark Pharmaceuticals",
        category: "Syrup",
        requiresPrescription: false,
        image: IMG_SYRUP,
        isActive: true
    },

    {
        name: "Cetzine Syrup 60ml",
        description: "Cetirizine + phenylephrine for cold and congestion, 60ml bottle.",
        price: 92,
        stock: 70,
        expiresOn: "2027-10-31",
        genericName: "Cetirizine + Phenylephrine",
        company: "Cipla",
        category: "Syrup",
        requiresPrescription: false,
        image: IMG_SYRUP,
        isActive: true
    },


    // =========================
    // VITAMINS / SUPPLEMENTS (OTC)
    // =========================

    {
        name: "Vitamin D3 60000 IU",
        description: "Weekly cholecalciferol chewable for deficiency, strip of 4.",
        price: 130,
        stock: 120,
        expiresOn: "2028-09-30",
        genericName: "Cholecalciferol",
        company: "Alkem Laboratories",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_VITAMIN,
        isActive: true
    },

    {
        name: "Becosules B-Complex",
        description: "Vitamin B-complex + C for energy and recovery, strip of 20.",
        price: 85,
        stock: 190,
        expiresOn: "2028-07-31",
        genericName: "Vitamin B Complex",
        company: "Pfizer",
        category: "Capsule",
        requiresPrescription: false,
        image: IMG_VITAMIN,
        isActive: true
    },

    {
        name: "Limcee 500mg Chewable",
        description: "Vitamin C chewable tablets supporting immune health, strip of 15.",
        price: 160,
        stock: 100,
        expiresOn: "2028-05-31",
        genericName: "Ascorbic Acid",
        company: "Abbott",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_VITAMIN,
        isActive: true
    },

    {
        name: "Shelcal Calcium + D3",
        description: "Calcium carbonate + vitamin D3 for bone health, strip of 15.",
        price: 145,
        stock: 110,
        expiresOn: "2028-08-31",
        genericName: "Calcium Carbonate + Cholecalciferol",
        company: "Torrent Pharmaceuticals",
        category: "Tablet",
        requiresPrescription: false,
        image: IMG_VITAMIN,
        isActive: true
    },


    // =========================
    // DERMATOLOGY / TOPICAL
    // =========================

    {
        name: "Clotrimazole Cream 1%",
        description: "Antifungal cream for skin infections, 30g tube.",
        price: 78,
        stock: 5,
        expiresOn: "2027-11-30",
        genericName: "Clotrimazole",
        company: "Glenmark Pharmaceuticals",
        category: "Cream",
        requiresPrescription: false,
        image: IMG_CREAM,
        isActive: true
    },


    // =========================
    // DEVICES / CONSUMABLES (OTC)
    // =========================

    {
        name: "Digital Thermometer",
        description: "Fast and accurate digital thermometer for measuring body temperature.",
        price: 299,
        stock: 45,
        expiresOn: "2030-01-01",
        genericName: "General",
        company: "Omron",
        category: "Device",
        requiresPrescription: false,
        image: IMG_DEVICE_THERMO,
        isActive: true
    },

    {
        name: "Blood Pressure Monitor",
        description: "Digital blood pressure monitor designed for convenient home monitoring.",
        price: 1499,
        stock: 25,
        expiresOn: "2030-12-31",
        genericName: "General",
        company: "Omron",
        category: "Device",
        requiresPrescription: false,
        image: IMG_DEVICE_BP,
        isActive: true
    },

    {
        name: "Pulse Oximeter",
        description: "Fingertip pulse oximeter for SpO2 and pulse-rate monitoring.",
        price: 899,
        stock: 5,
        expiresOn: "2030-06-30",
        genericName: "General",
        company: "BPL Medical Technologies",
        category: "Device",
        requiresPrescription: false,
        image: IMG_DEVICE_THERMO,
        isActive: true
    },

    {
        name: "Glucometer with 25 Strips",
        description: "Blood-glucose monitoring kit with 25 test strips and lancets.",
        price: 750,
        stock: 8,
        expiresOn: "2029-12-31",
        genericName: "General",
        company: "Accu-Chek",
        category: "Device",
        requiresPrescription: false,
        image: IMG_DEVICE_BP,
        isActive: true
    },

    {
        name: "N95 Face Masks (Pack of 10)",
        description: "Protective N95 respirator masks for everyday use, pack of 10.",
        price: 350,
        stock: 500,
        expiresOn: "2029-10-10",
        genericName: "General",
        company: "3M",
        category: "Consumable",
        requiresPrescription: false,
        image: IMG_DEVICE_THERMO,
        isActive: true
    },

    {
        name: "Hand Sanitizer 500ml",
        description: "Alcohol-based hand sanitizer for everyday hand hygiene, 500ml pump bottle.",
        price: 120,
        stock: 200,
        expiresOn: "2027-08-15",
        genericName: "General",
        company: "Cipla",
        category: "Consumable",
        requiresPrescription: false,
        image: IMG_SANITIZER,
        isActive: true
    },

    {
        name: "First Aid Kit",
        description: "Compact first aid kit containing essential medical supplies.",
        price: 599,
        stock: 30,
        expiresOn: "2029-03-20",
        genericName: "General",
        company: "MediTrust",
        category: "Consumable",
        requiresPrescription: false,
        image: IMG_FIRSTAID,
        isActive: true
    }
];


// =====================================================
// SEED DATABASE
// =====================================================

const seedDatabase = async () => {

    try {

        // -----------------------------------------------
        // CONNECT
        // -----------------------------------------------

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");


        // -----------------------------------------------
        // CLEAR DATABASE
        // -----------------------------------------------

        await User.deleteMany({});
        await Product.deleteMany({});
        await Pathologist.deleteMany({});
        await Doctor.deleteMany({}).catch(() => {});
        await PathologyTest.deleteMany({}).catch(() => {});
        await mongoose.connection.db.collection("carts").deleteMany({}).catch(() => {});
        await mongoose.connection.db.collection("orders").deleteMany({}).catch(() => {});
        await mongoose.connection.db.collection("chatmessages").deleteMany({}).catch(() => {});
        await mongoose.connection.db.collection("prescriptions").deleteMany({}).catch(() => {});
        await mongoose.connection.db.collection("creditrequests").deleteMany({}).catch(() => {});

        console.log("🗑️ Existing data cleared");


        // -----------------------------------------------
        // HASH PASSWORDS
        // -----------------------------------------------

        const hashedUsers = await Promise.all(

            users.map(async (user) => {

                const hashedPassword =
                    await bcrypt.hash(user.password, 10);

                return {
                    ...user,
                    password: hashedPassword
                };

            })

        );


        // -----------------------------------------------
        // CREATE USERS
        // -----------------------------------------------

        const createdUsers =
            await User.insertMany(hashedUsers);

        console.log(
            `👤 ${createdUsers.length} users created`
        );


        const findUserByEmail = (email) => {

            const user = createdUsers.find(
                (user) =>
                    user.email === email
            );

            if (!user) {
                throw new Error(
                    `User not found for ${email}`
                );
            }

            return user;
        };


        // -----------------------------------------------
        // CREATE DOCTOR PROFILES
        // -----------------------------------------------

        const doctors = doctorProfiles.map(
            (profile) => {

                const {
                    email,
                    ...doctorData
                } = profile;

                return {
                    ...doctorData,
                    user: findUserByEmail(email)._id
                };

            }
        );


        const createdDoctors =
            await Doctor.insertMany(doctors);

        console.log(
            `🩺 ${createdDoctors.length} doctors created`
        );


        // -----------------------------------------------
        // CREATE PATHOLOGIST PROFILES
        // -----------------------------------------------

        const pathologists = pathologistProfiles.map(
            (profile) => {

                const {
                    email,
                    ...pathologistData
                } = profile;

                return {
                    ...pathologistData,
                    user: findUserByEmail(email)._id
                };

            }
        );


        const createdPathologists =
            await Pathologist.insertMany(pathologists);

        console.log(
            `🔬 ${createdPathologists.length} pathologists created`
        );


        // -----------------------------------------------
        // CREATE PATHOLOGY TESTS
        // -----------------------------------------------

        const tests = pathologyTests.map(
            (test) => {

                const labUser = findUserByEmail(test.labEmail);

                const lab = createdPathologists.find(
                    (p) =>
                        p.user.toString() === labUser._id.toString()
                );

                if (!lab) {
                    throw new Error(
                        `Lab not found for ${test.labEmail}`
                    );
                }

                const {
                    labEmail,
                    ...testData
                } = test;

                return {
                    ...testData,
                    pathologist: lab._id
                };

            }
        );


        const createdTests =
            await PathologyTest.insertMany(tests);

        console.log(
            `🧪 ${createdTests.length} pathology tests created`
        );


        // -----------------------------------------------
        // CREATE PRODUCTS
        // -----------------------------------------------

        const createdProducts =
            await Product.insertMany(products);

        console.log(
            `💊 ${createdProducts.length} products created`
        );


        // -----------------------------------------------
        // SUMMARY
        // -----------------------------------------------

        console.log("\n================================");
        console.log("       SEEDING COMPLETED 🚀");
        console.log("================================");

        console.log(
            `👤 Users        : ${createdUsers.length}`
        );

        console.log(
            `🩺 Doctors      : ${createdDoctors.length}`
        );

        console.log(
            `🔬 Pathologists : ${createdPathologists.length}`
        );

        console.log(
            `🧪 Tests        : ${createdTests.length}`
        );

        console.log(
            `💊 Products     : ${createdProducts.length}`
        );


        // -----------------------------------------------
        // LOGIN DETAILS
        // -----------------------------------------------

        console.log("\n🔐 LOGIN CREDENTIALS");

        console.log("\nAdmin:");
        console.log("Email    : admin@example.com");
        console.log("Password : Admin@123");

        console.log("\nDoctor:");
        console.log("Email    : amit.doctor@example.com");
        console.log("Password : Doctor@123");

        console.log("\nPatient:");
        console.log("Email    : rahul@example.com");
        console.log("Password : Password@123");

        console.log("\nPathologist:");
        console.log("Email    : anjali.path@example.com");
        console.log("Password : Path@123");


        // -----------------------------------------------
        // CLOSE CONNECTION
        // -----------------------------------------------

        await mongoose.connection.close();

        console.log("\n✅ Database connection closed");

        process.exit(0);

    } catch (error) {

        console.error("\n❌ SEEDING FAILED");
        console.error(error);

        await mongoose.connection.close();

        process.exit(1);
    }
};


// =====================================================
// RUN
// =====================================================

seedDatabase();
