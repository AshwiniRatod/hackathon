# 🔐 ADMIN WEB AUTHENTICATION GUIDE

## 🚀 Quick Start

Your Nabha Telemedicine system has a **complete admin authentication system**! Here's how to access it:

### 📋 Admin Credentials
```
📞 Phone: 9876543210
🔑 Password: admin123
👤 Role: admin
✅ Status: Pre-verified
```

---

## 💻 OPTION 1: HTML Admin Dashboard (Recommended)

### 1️⃣ Start Your Backend Server
```bash
cd /Users/kuldeepraj/Desktop/SIH/Telemedicine
node server.js
```

### 2️⃣ Open Admin Dashboard
```bash
# Open in browser:
open admin-dashboard.html
# OR double-click the file in Finder
```

### 3️⃣ Login
- **Phone**: 9876543210
- **Password**: admin123
- Click "Login"

### 4️⃣ View Dashboard
- See real-time statistics
- Manage users, patients, doctors
- Monitor SOS alerts
- View ASHA worker reports

---

## 🔗 OPTION 2: Direct API Testing

### Login API
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","password":"admin123"}'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "phone": "9876543210",
    "role": "admin",
    "isVerified": true
  }
}
```

### Dashboard API
```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🌐 OPTION 3: Connect Harshal's Web Interface

### Method A: Point to Your Backend
Update Harshal's web frontend to use:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Method B: Dual Server Setup
```bash
# Your backend (Port 3000)
cd /Users/kuldeepraj/Desktop/SIH/Telemedicine
node server.js

# Harshal's web (Port 3001)
cd /Users/kuldeepraj/Desktop/harshal/Telemedicine-web
PORT=3001 npm run dev
```

---

## 📱 OPTION 4: Mobile Admin Access

Your React Native app can also be used for admin access:
```javascript
// Login with admin credentials in mobile app
phone: "9876543210"
password: "admin123"
// App will detect admin role and show admin features
```

---

## 🔧 Available Admin APIs

Your backend provides these admin endpoints:

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile

### Dashboard & Management
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Manage all users
- `GET /api/admin/reports` - System reports

### Data Management
- `GET /api/patients` - Patient management
- `GET /api/doctors` - Doctor management  
- `GET /api/asha` - ASHA worker management
- `GET /api/sos` - SOS alert management
- `GET /api/pharmacy` - Pharmacy management
- `GET /api/emergency` - Emergency management

---

## 🎯 Current Status

✅ **Backend Server**: Running on port 3000
✅ **Database**: Seeded with admin user
✅ **Authentication**: Working perfectly
✅ **Admin APIs**: All functional
✅ **HTML Dashboard**: Created and ready to use

---

## 🚀 Next Steps

1. **Use HTML Dashboard**: Open `admin-dashboard.html` in browser
2. **Integrate with Harshal's Web**: Connect his frontend to your backend
3. **Mobile Admin**: Use mobile app with admin credentials
4. **Custom Development**: Build on top of existing APIs

---

## 🔍 Testing Commands

```bash
# Test server health
curl http://localhost:3000/api/health

# Test admin login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","password":"admin123"}'

# Test dashboard (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer TOKEN"
```

---

## ⚡ Quick Commands

```bash
# Start everything
cd /Users/kuldeepraj/Desktop/SIH/Telemedicine
node server.js &
open admin-dashboard.html

# Stop server
pkill -f "node server.js"
```

---

**🎉 Your admin system is fully functional and ready to use!**