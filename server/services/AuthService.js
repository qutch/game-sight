import SteamStrategy from "passport-steam";
import passport from "passport";
import { initializeUserProfile } from "../services/DatabaseService.js";

export function initializeSteamAuth() {
    passport.use(new SteamStrategy.Strategy({
        returnURL: process.env.STEAM_RETURN_URL || 'http://localhost:5150/auth/steam/return',
        realm: 'http://localhost:5150',
        apiKey: process.env.STEAM_API_KEY
    },
    async function(identifier, profile, done) {
        try {
            console.log("Steam verify callback fired");
            const steamId = identifier.split('/').pop();
            console.log("Steam ID:", steamId);
            const user = {
                steamId: steamId,
                username: profile.displayName,
            };

            // Initialize full profile (user + friends) on login
            // Skips if already populated; runs in background so auth isn't blocked
            initializeUserProfile(steamId, user.username)
                .catch(err => console.error("Background profile init failed:", err));

            return done(null, user);
        } catch (err) {
            console.error("Steam auth error:", err);
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

export default passport;
