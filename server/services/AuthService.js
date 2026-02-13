import SteamStrategy from "passport-steam";
import passport from "passport";
import { addUserToDatabase, getUserFromDatabase } from "../services/DatabaseService.js";

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

            const dbUser = await getUserFromDatabase(steamId);
            if (!dbUser) {
                await addUserToDatabase(steamId, user.username);
            }

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
