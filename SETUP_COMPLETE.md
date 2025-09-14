# 🚀 Complete Setup Guide for Nabha Telemedicine Platform

## ✅ What's Already Working
- ✅ Backend API with MongoDB
- ✅ Web dashboards (Admin & Doctor)
- ✅ React Native mobile app structure
- ✅ Authentication system
- ✅ SOS alert system
- ✅ Multilingual support
- ✅ Offline-first architecture

## 🔧 What You Need to Update to Make It Work Completely

### 1. **Install Missing Dependencies**

#### Backend Dependencies
```powershell
cd C:\Users\windows\OneDrive\Desktop\sih
npm install
```

#### Web Dashboard Dependencies
```powershell
cd C:\Users\windows\OneDrive\Desktop\sih\web
npm install
```

#### Mobile App Dependencies
```powershell
cd C:\Users\windows\OneDrive\Desktop\sih\mobile
npm install --legacy-peer-deps
```

### 2. **Set Up Environment Variables**

#### Create .env file in root directory:
```powershell
cd C:\Users\windows\OneDrive\Desktop\sih
copy env.example .env
```

#### Edit .env file with your settings:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nabha_telemedicine
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=NABHA
```

### 3. **Start MongoDB Database**

#### Option A: Install MongoDB locally
```powershell
# Download and install MongoDB Community Server
# Start MongoDB service
net start MongoDB
```

#### Option B: Use MongoDB Atlas (Cloud)
```env
# Update MONGODB_URI in .env file
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nabha_telemedicine
```

### 4. **Seed the Database**

```powershell
cd C:\Users\windows\OneDrive\Desktop\sih
npm run seed
```

### 5. **Start All Services**

#### Terminal 1: Backend API
```powershell
cd C:\Users\windows\OneDrive\Desktop\sih
npm run dev
```

#### Terminal 2: Web Dashboards
```powershell
cd C:\Users\windows\OneDrive\Desktop\sih\web
npm run dev
```

#### Terminal 3: Mobile App
```powershell
cd C:\Users\windows\OneDrive\Desktop\sih\mobile
npx react-native start --reset-cache
```

#### Terminal 4: Run Android App
```powershell
cd C:\Users\windows\OneDrive\Desktop\sih\mobile
npx react-native run-android
```

### 6. **Fix Mobile App Issues**

#### Update API Configuration
Edit `mobile/src/config/api.js`:
```javascript
// Change this line:
const API_BASE_URL = 'http://localhost:5000/api';

// To this (for Android emulator):
const API_BASE_URL = 'http://10.0.2.2:5000/api';

// Or for physical device:
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:5000/api';
```

#### Fix Android Network Security
Add to `mobile/android/app/src/main/AndroidManifest.xml`:
```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

### 7. **Test the Complete System**

#### Run Connection Test
```powershell
cd C:\Users\windows\OneDrive\Desktop\sih
node test-connection.js
```

#### Access Points
- **Backend API**: http://localhost:5000/api/health
- **Web Portal**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Doctor Dashboard**: http://localhost:3000/doctor
- **Mobile App**: Android emulator/device

### 8. **Common Issues & Solutions**

#### Issue: 401 Authentication Errors
**Solution**: Already fixed with demo API endpoints

#### Issue: Mobile App Can't Connect to API
**Solution**: Update API_BASE_URL in mobile/src/config/api.js

#### Issue: MongoDB Connection Failed
**Solution**: 
1. Start MongoDB service
2. Check MONGODB_URI in .env file
3. Ensure MongoDB is running on port 27017

#### Issue: React Native Build Errors
**Solution**:
```powershell
cd mobile
npx react-native clean
npm install --legacy-peer-deps
npx react-native run-android
```

#### Issue: Web Dashboard Shows 401 Errors
**Solution**: Restart web server after the fix I applied

### 9. **Verification Checklist**

- [ ] Backend API responds at http://localhost:5000/api/health
- [ ] Web dashboards load without 401 errors
- [ ] Mobile app builds and runs on Android
- [ ] Database is seeded with demo data
- [ ] All three services are running simultaneously
- [ ] Mobile app can connect to backend API

### 10. **Production Deployment Notes**

For production deployment, you'll need to:
1. Set up proper authentication
2. Configure real SMS gateway
3. Set up SSL certificates
4. Configure production MongoDB
5. Set up proper error logging
6. Configure push notifications

## 🎯 Expected Results

After completing these steps, you should have:
- ✅ Fully functional backend API
- ✅ Working web dashboards with demo data
- ✅ Mobile app running on Android
- ✅ Complete offline-first functionality
- ✅ Multilingual support
- ✅ SOS emergency system
- ✅ All features working together

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all services are running
3. Check network connectivity
4. Ensure all dependencies are installed
5. Run the connection test script

The platform is designed to work completely offline-first, so even if some services are down, the mobile app will continue to function and sync when connectivity is restored.


