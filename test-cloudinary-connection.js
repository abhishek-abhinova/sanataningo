const axios = require('axios');

// Test Cloudinary connection
async function testCloudinaryConnection() {
  try {
    console.log('🔍 Testing Cloudinary API connection...');
    
    // Test 1: Check if backend is running
    const healthResponse = await axios.get('https://sarboshakti-backend.onrender.com/api/health');
    console.log('✅ Backend health check:', healthResponse.data);
    
    // Test 2: Check if Cloudinary route exists (should get 401 without auth)
    try {
      const cloudinaryResponse = await axios.get('https://sarboshakti-backend.onrender.com/api/cloudinary/gallery');
      console.log('✅ Cloudinary route accessible:', cloudinaryResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Cloudinary route exists (requires authentication)');
      } else if (error.response?.status === 404) {
        console.log('❌ Cloudinary route not found (404)');
      } else {
        console.log('⚠️ Cloudinary route error:', error.response?.status, error.response?.data);
      }
    }
    
    // Test 3: Check environment variables (from your .env.production)
    console.log('\n📋 Expected Cloudinary Environment Variables:');
    console.log('CLOUDINARY_CLOUD_NAME: dbzx5y9ds');
    console.log('CLOUDINARY_API_KEY: 511921135832342');
    console.log('CLOUDINARY_API_SECRET: [HIDDEN]');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testCloudinaryConnection();