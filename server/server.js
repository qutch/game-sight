// Import packages
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import steamRoutes from '../server/routes/steam.js';
import authRoutes from '../server/routes/auth.js';
import { initializeSteamAuth } from './services/AuthService.js';
import passport from 'passport';

// Dot env config
dotenv.config({path: '../.env'});

// Constants
const app = express()
const PORT = process.env.PORT || 5150

// Middleware
app.use(cors({
    origin: 'http://localhost:5840',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));

// Passport initialization
initializeSteamAuth();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/steam', steamRoutes);

// Routers
app.get('/', (req, res) => {
    res.send("hey")
})

app.get('/health', (req, res) => {
    res.send("ok")
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
