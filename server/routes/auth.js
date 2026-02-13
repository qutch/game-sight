// Import packages
import express from 'express';
import passport from 'passport';

// Constants
const router = express.Router();

// AUTH SECTION
// Redirect to Steam login
router.get('/steam/login', passport.authenticate('steam', { failureRedirect: '/' }));

// Steam return callback - Passport handles verification automatically
router.get('/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
        // User is now authenticated
        // Redirect to frontend profile page
        res.redirect(`${'http://localhost:5840'}/profile`);
    }
);

// Check if user is authenticated (for frontend to verify session)
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                steamId: req.user.steamId,
                username: req.user.username,
                profileUrl: req.user.profileUrl
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

export default router;
