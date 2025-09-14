# 🚀 Quick Setup Guide - Connect to Your SIH Backend

## 📋 Step-by-Step Instructions

### 1. Start Your SIH Backend Server
Navigate to your existing backend folder and start the server:
```bash
cd Desktop/sih/telemedicine
npm start
# or
node server.js
# or
nodemon server.js
```

### 2. Check Which Port Your Backend Uses
Your backend is likely running on one of these ports:
- `http://localhost:3000`
- `http://localhost:5000` 
- `http://localhost:8000`
- `http://localhost:8080`
- `http://localhost:4000`

### 3. Open the Admin Portal
1. Open `admin-login.html` in your browser
2. The page will automatically detect your backend
3. You should see a green "✅ Connected to backend on port XXXX" message

### 4. Login Credentials

#### If your backend is running:
Use your existing admin credentials from your SIH backend

#### If backend is not detected (Demo Mode):
```
Email: admin@sih.com
Password: admin123
```

### 5. Backend Authentication Endpoints

The system will automatically test these common endpoints:
- `/api/auth/login`
- `/api/admin/login`
- `/api/user/login`
- `/auth/login`
- `/admin/login`
- `/login`

## 🔧 Configuration

### Update Backend URL (if needed)
Edit `assets/js/config.js` and change the port:
```javascript
api: {
    baseUrl: 'http://localhost:YOUR_PORT/api'
}
```

### Common Backend Patterns Supported

#### 1. Standard Express.js Pattern:
```javascript
app.post('/api/auth/login', (req, res) => {
    // Your login logic
    res.json({
        token: 'jwt_token',
        user: { id, email, name, role }
    });
});
```

#### 2. Admin-specific Endpoint:
```javascript
app.post('/api/admin/login', (req, res) => {
    // Admin login logic
});
```

#### 3. Role-based Authentication:
```javascript
app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    // Handle different roles
});
```

## 🧪 Testing

### Integration Test Page
Open `test-integration.html` to:
- Test backend connectivity
- Verify API endpoints
- Check WebSocket connection
- Run comprehensive tests

### Debug Mode
1. Open browser Developer Tools (F12)
2. Check Console tab for connection logs
3. Look for these messages:
   - "🔍 Searching for your existing backend..."
   - "✅ Found backend running on port XXXX"
   - "🔐 Attempting login to http://localhost:XXXX..."

## 🔐 Authentication Response Formats

Your backend can return any of these formats:

### Format 1 (Recommended):
```json
{
    "success": true,
    "token": "your_jwt_token",
    "user": {
        "id": "user_id",
        "email": "admin@example.com",
        "name": "Admin Name",
        "role": "admin"
    }
}
```

### Format 2 (Also Supported):
```json
{
    "accessToken": "your_jwt_token",
    "userData": {
        "email": "admin@example.com",
        "firstName": "Admin",
        "lastName": "User"
    }
}
```

### Format 3 (Common Pattern):
```json
{
    "token": "your_jwt_token",
    "id": "user_id",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
}
```

## ❌ Troubleshooting

### Backend Not Detected
1. ✅ Ensure your backend server is running
2. ✅ Check the port number in console logs
3. ✅ Verify CORS is enabled in your backend
4. ✅ Check firewall/antivirus settings

### Login Fails
1. ✅ Check browser console for error messages
2. ✅ Verify your backend login endpoint works (test with Postman)
3. ✅ Ensure your backend accepts JSON requests
4. ✅ Check for CORS issues

### CORS Configuration
Add this to your backend if needed:
```javascript
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
```

## 🎉 Success Indicators

### ✅ Everything Working:
- Green connection status on login page
- Successful login redirects to admin dashboard
- Real-time features work
- API calls succeed

### ⚠️ Demo Mode:
- Yellow warning about backend not found
- Login with demo credentials works
- Limited functionality (no real data)

## 📞 Need Help?

1. **Check Console Logs**: Press F12 → Console tab
2. **Test Integration**: Open `test-integration.html`
3. **Verify Backend**: Test your backend with Postman/curl
4. **Check Network**: Ensure no firewall blocks localhost connections

## 🔗 Quick Links

- **Admin Login**: `admin-login.html`
- **Doctor Login**: `doctor-login.html`
- **Test Suite**: `test-integration.html`
- **Configuration**: `assets/js/config.js`

---

**Ready to login! 🚀**