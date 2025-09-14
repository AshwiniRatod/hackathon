const axios = require('axios');

async function testConnections() {
  console.log('🔍 Testing Nabha Telemedicine Platform Connections...\n');

  // Test Backend API
  try {
    console.log('1. Testing Backend API (http://localhost:5000)...');
    const backendResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend API: Connected');
    console.log(`   Status: ${backendResponse.data.status}`);
    console.log(`   Message: ${backendResponse.data.message}\n`);
  } catch (error) {
    console.log('❌ Backend API: Failed to connect');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test Web Server
  try {
    console.log('2. Testing Web Server (http://localhost:3000)...');
    const webResponse = await axios.get('http://localhost:3000');
    console.log('✅ Web Server: Connected');
    console.log(`   Status: ${webResponse.status}\n`);
  } catch (error) {
    console.log('❌ Web Server: Failed to connect');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test Web Dashboard APIs
  try {
    console.log('3. Testing Web Dashboard APIs...');
    const dashboardResponse = await axios.get('http://localhost:3000/api/admin/dashboard');
    console.log('✅ Admin Dashboard API: Working');
    console.log(`   Total Patients: ${dashboardResponse.data.totalPatients}`);
    console.log(`   Total Doctors: ${dashboardResponse.data.totalDoctors}\n`);
  } catch (error) {
    console.log('❌ Web Dashboard APIs: Failed');
    console.log(`   Error: ${error.message}\n`);
  }

  console.log('🎯 Connection Test Complete!');
  console.log('\n📱 Access Points:');
  console.log('   • Backend API: http://localhost:5000');
  console.log('   • Web Portal: http://localhost:3000');
  console.log('   • Admin Dashboard: http://localhost:3000/admin');
  console.log('   • Doctor Dashboard: http://localhost:3000/doctor');
}

testConnections().catch(console.error);


