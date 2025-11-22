// Clean server startup script
console.log('🚀 Starting Sarboshakti Backend Server...');
console.log('📅 Timestamp:', new Date().toISOString());
console.log('🔧 Node Version:', process.version);
console.log('📁 Working Directory:', process.cwd());

// Suppress deprecation warnings
process.noDeprecation = true;

// Clear console
console.clear();

// Start the server
require('./server.js');