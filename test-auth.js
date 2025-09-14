// Simple authentication test script
const http = require('http');

function testAuth(email, password, role) {
    const postData = JSON.stringify({ email, password });
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
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
                    const response = JSON.parse(data);
                    console.log(`\n✅ ${role} Authentication Test:`);
                    console.log(`📧 Email: ${email}`);
                    console.log(`🔒 Password: ${password}`);
                    console.log(`📊 Status: ${res.statusCode}`);
                    console.log(`🎯 Response:`, response);
                    
                    if (response.success && response.user && response.user.role === role.toLowerCase()) {
                        console.log(`✅ ${role} login successful!`);
                        resolve(response);
                    } else {
                        console.log(`❌ ${role} login failed!`);
                        reject(new Error(`${role} login failed`));
                    }
                } catch (error) {
                    console.log(`❌ JSON Parse Error:`, error.message);
                    console.log(`Raw response:`, data);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error(`❌ Request Error:`, error.message);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function runTests() {
    console.log('🚀 Starting Authentication Tests...\n');
    
    try {
        // Test Admin Authentication
        await testAuth('admin@nabha.com', 'admin123', 'Admin');
        
        // Test Doctor Authentication  
        await testAuth('dr.rajesh@nabha.com', 'doctor123', 'Doctor');
        
        console.log('\n🎉 All authentication tests passed!');
    } catch (error) {
        console.error('\n💥 Authentication tests failed:', error.message);
    }
}

runTests();