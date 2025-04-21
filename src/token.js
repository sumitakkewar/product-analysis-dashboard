import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to generate token
const generateToken = (userId, expiresIn = '1h') => {
    const payload = {
        id: userId,
        timestamp: new Date().toISOString()
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Ask for user input
rl.question('Enter user ID: ', (userId) => {
    rl.question('Enter token expiration (e.g., 1h, 1d, 1w) [default: 1h]: ', (expiresIn) => {
        try {
            const token = generateToken(userId, expiresIn || '1h');
            console.log('\nGenerated Token:');
            console.log(token);
            console.log('\nToken will expire in:', expiresIn || '1h');
        } catch (error) {
            console.error('Error generating token:', error.message);
        }
        rl.close();
    });
}); 