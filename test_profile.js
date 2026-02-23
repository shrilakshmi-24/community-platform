const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: '70d45b83-db78-4ae0-b324-9b533f239c2f', role: 'ADMIN', isBusinessOwner: false }, 'your-super-secret-jwt-key-change-this-in-production-min-32-chars');

fetch('http://localhost:5000/api/profile/update', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        occupation: 'Developer',
        company: 'ACME'
    })
}).then(res => res.json().then(data => console.log('Status:', res.status, 'Data:', data))).catch(console.error);
