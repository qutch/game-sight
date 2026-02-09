// Database Services --> reads/writes to the database
import { createClient } from '@supabase/supabase-js';

dotenv.config({path: '../.env'});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// AUTH

    // Create authenticated user
    export async function createAuthUser() {
        const user = await supabase.auth.admin.createUser();
    }

// USERS

    // Add user to USERS table
    export async function addUserToDatabase(steamId) {

    }

    // Remove user from USERS table
    export async function removeUserFromDatabase(steamId) {

    }

    // Get user from USERS table
    export async function getUserFromDatabase(steamId) {

    }

    // Update user in USERS table
    export async function updateUserInDatabase(steamId) {

    }

// GAMES

    // Add game to GAMES table

    // Remove game from GAMES table

    // Get game from GAMES table

    // Update game in GAMES table

// FRIENDS

    // Add friend to FRIENDS table

    // Remove friend from FRIENDS table

    // Get friends from FRIENDS table

    // Update friend in FRIENDS table

// PLAYTIME SNAPSHOTS (immutable records of playtime at a specific date)

    // Add playtime snapshot to PLAYTIME_SNAPSHOTS table

    // Remove playtime snapshot from PLAYTIME_SNAPSHOTS table

    // Get playtime snapshots from PLAYTIME_SNAPSHOTS tables


