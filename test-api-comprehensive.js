// Comprehensive API endpoints test
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
                try {
                    const response = data ? JSON.parse(data) : {};
                    resolve({
                        statusCode: res.statusCode,
                        response: response
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        response: { rawData: data }
                    });
                }
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

async function runAPITests() {
    console.log('🚀 Starting Comprehensive API Tests...\n');
    
    let adminToken = null;
    let doctorToken = null;
    
    try {
        // Test 1: Health Check
        console.log('📊 Test 1: Health Check');
        const healthCheck = await makeRequest('GET', '/api/health');
        console.log(`Status: ${healthCheck.statusCode}`);
        console.log(`Response:`, healthCheck.response);
        console.log(healthCheck.statusCode === 200 ? '✅ PASS' : '❌ FAIL');
        console.log('');
        
        // Test 2: Admin Login
        console.log('📊 Test 2: Admin Login');
        const adminLogin = await makeRequest('POST', '/api/auth/login', {
            email: 'admin@nabha.com',
            password: 'admin123'
        });
        console.log(`Status: ${adminLogin.statusCode}`);
        console.log(`Success: ${adminLogin.response.success}`);
        if (adminLogin.response.success) {
            adminToken = adminLogin.response.token;
            console.log(`Token: ${adminToken.substring(0, 20)}...`);
            console.log(`User: ${adminLogin.response.user.name} (${adminLogin.response.user.role})`);
        }
        console.log(adminLogin.response.success ? '✅ PASS' : '❌ FAIL');
        console.log('');
        
        // Test 3: Doctor Login
        console.log('📊 Test 3: Doctor Login');
        const doctorLogin = await makeRequest('POST', '/api/auth/login', {
            email: 'dr.rajesh@nabha.com',
            password: 'doctor123'
        });
        console.log(`Status: ${doctorLogin.statusCode}`);
        console.log(`Success: ${doctorLogin.response.success}`);
        if (doctorLogin.response.success) {
            doctorToken = doctorLogin.response.token;
            console.log(`Token: ${doctorToken.substring(0, 20)}...`);
            console.log(`User: ${doctorLogin.response.user.name} (${doctorLogin.response.user.role})`);
        }
        console.log(doctorLogin.response.success ? '✅ PASS' : '❌ FAIL');
        console.log('');
        
        // Test 4: Invalid Login
        console.log('📊 Test 4: Invalid Login (should fail)');
        const invalidLogin = await makeRequest('POST', '/api/auth/login', {
            email: 'invalid@test.com',
            password: 'wrongpassword'
        });
        console.log(`Status: ${invalidLogin.statusCode}`);
        console.log(`Success: ${invalidLogin.response.success}`);
        console.log(`Message: ${invalidLogin.response.message}`);
        console.log(!invalidLogin.response.success ? '✅ PASS (correctly rejected)' : '❌ FAIL');
        console.log('');
        
        // Test 5: Second Doctor Login
        console.log('📊 Test 5: Second Doctor Login');
        const doctor2Login = await makeRequest('POST', '/api/auth/login', {
            email: 'dr.priya@nabha.com',
            password: 'doctor123'
        });
        console.log(`Status: ${doctor2Login.statusCode}`);
        console.log(`Success: ${doctor2Login.response.success}`);
        if (doctor2Login.response.success) {
            console.log(`User: ${doctor2Login.response.user.name} (${doctor2Login.response.user.role})`);
            console.log(`Specialization: ${doctor2Login.response.user.specialization || 'Not specified'}`);
        }
        console.log(doctor2Login.response.success ? '✅ PASS' : '❌ FAIL');
        console.log('');
        
        // Test 6: Different HTTP Methods
        console.log('📊 Test 6: Wrong HTTP Method (should fail)');
        const wrongMethod = await makeRequest('GET', '/api/auth/login');
        console.log(`Status: ${wrongMethod.statusCode}`);
        console.log(wrongMethod.statusCode === 404 || wrongMethod.statusCode === 405 ? '✅ PASS (correctly rejected)' : '❌ FAIL');
        console.log('');
        
        // Summary
        console.log('🎯 API Test Summary:');
        console.log(`✅ Health Check: ${healthCheck.statusCode === 200 ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Admin Login: ${adminLogin.response.success ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Doctor Login: ${doctorLogin.response.success ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Invalid Login: ${!invalidLogin.response.success ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Second Doctor: ${doctor2Login.response.success ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Wrong Method: ${wrongMethod.statusCode >= 400 ? 'PASS' : 'FAIL'}`);
        
        const allPassed = healthCheck.statusCode === 200 && 
                         adminLogin.response.success && 
                         doctorLogin.response.success && 
                         !invalidLogin.response.success && 
                         doctor2Login.response.success && 
                         wrongMethod.statusCode >= 400;
        
        console.log('');
        console.log(allPassed ? '🎉 ALL API TESTS PASSED!' : '💥 SOME TESTS FAILED!');
        
        return { adminToken, doctorToken, allPassed };
        
    } catch (error) {
        console.error('❌ API Tests failed:', error.message);
        return { adminToken, doctorToken, allPassed: false };
    }
}

// Run the tests
runAPITests().then(result => {
    console.log('\n🔐 Tokens for further testing:');
    if (result.adminToken) console.log(`Admin Token: ${result.adminToken.substring(0, 30)}...`);
    if (result.doctorToken) console.log(`Doctor Token: ${result.doctorToken.substring(0, 30)}...`);
});