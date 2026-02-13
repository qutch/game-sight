// Database Services --> reads/writes to the database
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// USERS

    // Add user to USERS table
    export async function addUserToDatabase(steamId, username) {
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([{
                    steam_id: steamId,
                    steam_name: username,
                }]);
            if (error) {
                console.error("Error adding user:", error);
                return null;
            }
            console.log("user added to db");
            return data;
        } catch (error) {
            console.error("Error adding user:", error);
            return null;
        }
    }

    // Remove user from USERS table
    export async function removeUserFromDatabase(steamId) {

    }

    // Get user from USERS table
    export async function getUserFromDatabase(steamId) {
    try {
        console.log("fetching user from db");
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('steam_id', steamId)
            .single();
        
        if (error) return null;
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
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


