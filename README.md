# 🏥 Nabha Telemedicine Platform - SIH 2025

A comprehensive telemedicine solution for rural healthcare delivery in Punjab, developed for Smart India Hackathon 2025.

## 🎯 Project Overview

This project provides a complete telemedicine ecosystem consisting of:
- **📱 React Native Mobile App** - For patients and ASHA workers  
- **🚀 Node.js Backend API** - Unified server handling all operations
- **🌐 Web Interface** - For doctors and administrators
- **🔄 Real-time Communication** - Socket.IO integration

## 👥 Target Users

### 📱 Mobile App Users
- **👨‍🌾 Farmers/Rural Patients** - Access healthcare services
- **👩‍⚕️ ASHA Workers** - Community health management tools

### 🌐 Web Interface Users  
- **👨‍⚕️ Doctors** - Patient consultations and medical records
- **🏥 Administrators** - System management and analytics

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally)
- Git

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/harshalmandliya/Telemedicine.git
cd Telemedicine
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install web frontend dependencies**
```bash
cd web
npm install
cd ..
```

4. **Set up environment variables**
```bash
cp env.example .env
# Edit .env file with your configurations
```

5. **Start MongoDB** (make sure MongoDB is running)

6. **Seed the database** (optional)
```bash
npm run seed
```

### Running the Application

1. **Start the backend server**
```bash
npm run dev
```
Server will run on: http://localhost:5000

2. **Start the web frontend** (in a new terminal)
```bash
cd web
npm run dev
```
Web app will run on: http://localhost:3000

## 🌟 Features

### Web Dashboard Features
- **Multi-role Authentication** (Patient, Doctor, ASHA, Admin)
- **Admin Dashboard** - User management, analytics, system overview
- **Doctor Dashboard** - Patient consultations, prescriptions, health records
- **Real-time Notifications** via Socket.io
- **Responsive Design** - Works on desktop, tablet, and mobile browsers
- **Secure Authentication** - JWT-based session management

### Backend API Features
- **RESTful APIs** for all healthcare operations
- **Role-based Access Control** (RBAC)
- **JWT Authentication** with refresh tokens
- **MongoDB Database** with Mongoose ODM
- **File Upload Support** for medical documents
- **SMS/Email Notifications** (Twilio/SMTP integration)
- **Rate Limiting** for API security
- **Comprehensive Error Handling**

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Multer** - File uploads
- **Twilio** - SMS notifications

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Webpack** - Module bundler
- **HTML5/CSS3** - Responsive UI
- **Socket.io Client** - Real-time updates
