const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'sarboshakti';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Bcrypt Hash:', hash);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash validation:', isValid);
    
    console.log('\nSQL Command:');
    console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@sarboshaktisonatanisangathan.org';`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

generateHash();