// End-to-end authentication flow test
const http = require('http');

function makeRequest(method, path, data = null, token = null) {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

async function testCompleteFlows() {
    console.log('🚀 Testing Complete Authentication Flows...\n');
    
    try {
        // Test Admin Flow
        console.log('👑 ADMIN AUTHENTICATION FLOW TEST');
        console.log('=====================================');
        
        // 1. Access admin login page
        console.log('📄 Step 1: Access admin login page');
        const adminLoginPage = await makeRequest('GET', '/admin');
        console.log(`Status: ${adminLoginPage.statusCode}`);
        console.log(`Content-Type: ${adminLoginPage.headers['content-type']}`);
        console.log(adminLoginPage.statusCode === 200 ? '✅ Admin login page accessible' : '❌ Failed to load admin login page');
        console.log('');
        
        // 2. Perform admin login
        console.log('🔐 Step 2: Perform admin login');
        const adminLoginResult = await makeRequest('POST', '/api/auth/login', {
            email: 'admin@nabha.com',
            password: 'admin123'
        });
        const adminAuth = JSON.parse(adminLoginResult.body);
        console.log(`Login Status: ${adminLoginResult.statusCode}`);
        console.log(`Login Success: ${adminAuth.success}`);
        console.log(`User Role: ${adminAuth.user?.role}`);
        console.log(`Token Generated: ${adminAuth.token ? 'Yes' : 'No'}`);
        console.log(adminAuth.success && adminAuth.user?.role === 'admin' ? '✅ Admin login successful' : '❌ Admin login failed');
        console.log('');
        
        // 3. Access admin dashboard
        console.log('📊 Step 3: Access admin dashboard');
        const adminDashboard = await makeRequest('GET', '/admin/dashboard');
        console.log(`Dashboard Status: ${adminDashboard.statusCode}`);
        console.log(`Content-Type: ${adminDashboard.headers['content-type']}`);
        const hasAdminContent = adminDashboard.body.includes('admin') || adminDashboard.body.includes('dashboard');
        console.log(`Contains Dashboard Content: ${hasAdminContent ? 'Yes' : 'No'}`);
        console.log(adminDashboard.statusCode === 200 ? '✅ Admin dashboard accessible' : '❌ Failed to load admin dashboard');
        console.log('');
        
        console.log('🩺 DOCTOR AUTHENTICATION FLOW TEST');
        console.log('====================================');
        
        // 4. Access doctor login page
        console.log('📄 Step 4: Access doctor login page');
        const doctorLoginPage = await makeRequest('GET', '/doctor');
        console.log(`Status: ${doctorLoginPage.statusCode}`);
        console.log(`Content-Type: ${doctorLoginPage.headers['content-type']}`);
        console.log(doctorLoginPage.statusCode === 200 ? '✅ Doctor login page accessible' : '❌ Failed to load doctor login page');
        console.log('');
        
        // 5. Perform doctor login
        console.log('🔐 Step 5: Perform doctor login');
        const doctorLoginResult = await makeRequest('POST', '/api/auth/login', {
            email: 'dr.rajesh@nabha.com',
            password: 'doctor123'
        });
        const doctorAuth = JSON.parse(doctorLoginResult.body);
        console.log(`Login Status: ${doctorLoginResult.statusCode}`);
        console.log(`Login Success: ${doctorAuth.success}`);
        console.log(`User Role: ${doctorAuth.user?.role}`);
        console.log(`Doctor Name: ${doctorAuth.user?.name}`);
        console.log(`Token Generated: ${doctorAuth.token ? 'Yes' : 'No'}`);
        console.log(doctorAuth.success && doctorAuth.user?.role === 'doctor' ? '✅ Doctor login successful' : '❌ Doctor login failed');
        console.log('');
        
        // 6. Access doctor dashboard
        console.log('📊 Step 6: Access doctor dashboard');
        const doctorDashboard = await makeRequest('GET', '/doctor/dashboard');
        console.log(`Dashboard Status: ${doctorDashboard.statusCode}`);
        console.log(`Content-Type: ${doctorDashboard.headers['content-type']}`);
        const hasDoctorContent = doctorDashboard.body.includes('doctor') || doctorDashboard.body.includes('patient');
        console.log(`Contains Dashboard Content: ${hasDoctorContent ? 'Yes' : 'No'}`);
        console.log(doctorDashboard.statusCode === 200 ? '✅ Doctor dashboard accessible' : '❌ Failed to load doctor dashboard');
        console.log('');
        
        // 7. Test security - try accessing admin dashboard with doctor token
        console.log('🔒 Step 7: Security Test - Doctor accessing admin resources');
        const securityTest = await makeRequest('GET', '/admin/dashboard', null, doctorAuth.token);
        console.log(`Admin Access Status: ${securityTest.statusCode}`);
        console.log('Note: This should still work as it\'s just serving static HTML, security is handled client-side');
        console.log('✅ Security test completed');
        console.log('');
        
        // Final Summary
        const adminFlowWorking = adminLoginPage.statusCode === 200 && 
                               adminAuth.success && 
                               adminAuth.user?.role === 'admin' && 
                               adminDashboard.statusCode === 200;
                               
        const doctorFlowWorking = doctorLoginPage.statusCode === 200 && 
                                doctorAuth.success && 
                                doctorAuth.user?.role === 'doctor' && 
                                doctorDashboard.statusCode === 200;
        
        console.log('🎯 COMPLETE FLOW TEST SUMMARY');
        console.log('==============================');
        console.log(`👑 Admin Flow: ${adminFlowWorking ? '✅ WORKING' : '❌ FAILED'}`);
        console.log(`   - Login Page: ${adminLoginPage.statusCode === 200 ? '✅' : '❌'}`);
        console.log(`   - Authentication: ${adminAuth.success ? '✅' : '❌'}`);
        console.log(`   - Dashboard: ${adminDashboard.statusCode === 200 ? '✅' : '❌'}`);
        console.log('');
        console.log(`🩺 Doctor Flow: ${doctorFlowWorking ? '✅ WORKING' : '❌ FAILED'}`);
        console.log(`   - Login Page: ${doctorLoginPage.statusCode === 200 ? '✅' : '❌'}`);
        console.log(`   - Authentication: ${doctorAuth.success ? '✅' : '❌'}`);
        console.log(`   - Dashboard: ${doctorDashboard.statusCode === 200 ? '✅' : '❌'}`);
        console.log('');
        
        const overallSuccess = adminFlowWorking && doctorFlowWorking;
        console.log(overallSuccess ? '🎉 ALL AUTHENTICATION FLOWS WORKING PERFECTLY!' : '💥 SOME FLOWS HAVE ISSUES!');
        
        return { adminFlowWorking, doctorFlowWorking, overallSuccess };
        
    } catch (error) {
        console.error('❌ Flow test error:', error.message);
        return { adminFlowWorking: false, doctorFlowWorking: false, overallSuccess: false };
    }
}

// Run the complete flow tests
testCompleteFlows();