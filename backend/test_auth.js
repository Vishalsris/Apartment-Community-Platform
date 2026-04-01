const axios = require('axios');

async function testAuth() {
  const email = `test_${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Test User';

  try {
    console.log('--- Testing Registration ---');
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name,
      email,
      password,
      role: 'Resident',
      apartmentNumber: 'A-101',
      phoneNumber: '1234567890'
    });
    console.log('Registration Success:', regRes.data);

    console.log('\n--- Testing Login ---');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    console.log('Login Success:', loginRes.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAuth();
