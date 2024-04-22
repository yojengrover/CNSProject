const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const pyotp = require('pyotp');
const qrcode = require('qrcode');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const PRIVATE_KEY_PATH = './private_key.pem';
const PUBLIC_KEY_PATH = './public_key.pem';
const SECRET_KEY = 'your_secret_key';
const users = {
    'user1': {
        'username': 'user1',
        'password_hash': '$2b$12$KlI8rPnW2t0e/kW9RDKFZecGYzkudOtVrc8xJS0HHV9R4zEjTOnzG', // bcrypt hash of 'password123'
        '2fa_enabled': false,
        'secret_key': null
    },
    'user2': {
        'username': 'user2',
        'password_hash': '$2b$12$PIPNpdmwfo3aYQoMPXsELehVOb5Wq2pIb77hdS8LwLoEn5OaZk1L6', // bcrypt hash of 'securepass456'
        '2fa_enabled': false,
        'secret_key': null
    }
};

// Rate limiter to prevent brute force attacks
const rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 1,
});

// Middleware for rate limiting
const rateLimitMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).json({ message: 'Too many requests. Please try again later.' });
        });
};

// Middleware to check JWT token
const tokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Token is missing' });

    jwt.verify(token.split(" ")[1], fs.readFileSync(PUBLIC_KEY_PATH), { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token is invalid' });
        req.username = decoded.username;
        next();
    });
};

// Function to generate JWT token
function generateToken(username) {
    return jwt.sign({ username }, fs.readFileSync(PRIVATE_KEY_PATH), { algorithm: 'RS256' });
}

// Route to render login form
app.get('/login', (req, res) => {
    res.send('Render login form here');
});

// Route to render registration form
app.get('/register', (req, res) => {
    res.send('Render registration form here');
});

// Route for user registration
app.post('/register', rateLimitMiddleware, async (req, res) => {
    const { username, password } = req.body;

    if (username in users) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    users[username] = { username, password_hash, mfa_enabled: false, secret_key: null };
    res.status(201).json({ message: 'User registered successfully' });
});

// Route for user login
app.post('/login', rateLimitMiddleware, async (req, res) => {
    const { username, password } = req.body;

    if (!(username in users)) {
        return res.status(401).json({ message: 'User does not exist' });
    }

    const user = users[username];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(username);
    res.status(200).json({ token });
});

// Implement logout to clear session
app.post('/logout', (req, res) => {
    // Clear session logic
    res.status(200).json({ message: 'Logged out successfully' });
});

// Protected route now can use session
app.get('/protected', tokenMiddleware, (req, res) => {
    res.status(200).json({ message: `Hello, ${req.username}! This is a protected route.` });
});

// Route for enabling 2FA
app.post('/enable-2fa', tokenMiddleware, async (req, res) => {
    const { username } = req;
    const user = users[username];
    
    // Generate and save secret key
    const secret_key = pyotp.randomBase32();
    users[username].secret_key = secret_key;
    users[username].mfa_enabled = true;

    // Generate QR code
    const otpauthUrl = pyotp.totp.genOTPauthURL(username, 'Flask 2FA Example', secret_key);
    const qr_code = await qrcode.toDataURL(otpauthUrl);

    res.status(200).json({ qr_code });
});

// Route for verifying 2FA setup
app.post('/verify-2fa-setup', tokenMiddleware, (req, res) => {
    const { username } = req;
    const user = users[username];
    const otp = req.body.otp;

    // Verify OTP
    const isValid = pyotp.totp.verify(otp, user.secret_key);
    if (isValid) {
        res.status(200).json({ message: '2FA setup successful' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

// Route for token refresh
app.post('/refresh', tokenMiddleware, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const { username } = req;

    const new_token = generateToken(username);
    res.status(200).json({ token: new_token });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
