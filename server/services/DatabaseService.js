// Database Services --> reads/writes to the database
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { getNumberPlayerAchievements, getPlayerSummary, getUserFriends, getOwnedGames } from './SteamService.js';

dotenv.config({path: '../.env'});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);



// PROFILE CREATION INITIALIZATION
export async function initializeUserProfile(steamId, username) {
    try {
        // Add user profile to database (skip if already exists)
        const existingUser = await getUserFromDatabase(steamId);
        if (!existingUser) {
            await addUserToDatabase(steamId, username);
        }

        // Add user's friends to database (skip if already populated)
        const existingFriends = await getFriendsFromDatabase(steamId);
        if (!existingFriends || existingFriends.length === 0) {
            const friends = await getUserFriends(steamId);
            console.log(`Populating ${friends.length} friends for ${steamId}`);
            for (const friend of friends) {
                let friendName = "Unknown";
                try {
                    const summary = await getPlayerSummary(friend.steamid);
                    friendName = summary.personaname;
                } catch {
                    // Keep default "Unknown" if we can't fetch the name
                }
                await addFriendToDatabase(steamId, friend.steamid, friendName);
            }
            console.log(`Finished populating friends for ${steamId}`);
        }
    } catch (error) {
        console.error("Error initializing user profile:", error);
    }
}

// Populate friends and games for an existing user (skips user creation)
export async function populateFriendsAndGames(steamId) {
    try {
        // Add user's friends to database
        const friends = await getUserFriends(steamId);
        console.log(`Populating ${friends.length} friends for ${steamId}`);
        for (const friend of friends) {
            let friendName = "Unknown";
            try {
                const summary = await getPlayerSummary(friend.steamid);
                friendName = summary.personaname;
            } catch {
                // Keep default "Unknown" if we can't fetch the name
            }
            await addFriendToDatabase(steamId, friend.steamid, friendName);
        }

        // Add user's games to database
        const games = await getOwnedGames(steamId);
        console.log(`Populating ${games.length} games for ${steamId}`);
        for (const game of games) {
            let achievements_complete = 0;
            try {
                achievements_complete = await getNumberPlayerAchievements(steamId, game.appid);
            } catch {
                // Game may not have achievements
            }
            const lastPlayed = new Date(game.rtime_last_played * 1000).toISOString();
            await addGameToUserList(steamId, game.appid, game.playtime_forever, achievements_complete, lastPlayed);
        }
        console.log(`Finished populating friends and games for ${steamId}`);
    } catch (error) {
        console.error("Error populating friends and games:", error);
    }
}


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

// Add game to user's games
export async function addGameToUserList(steamId, appId, playtime, achievementsComplete, lastPlayed) {
    try {
        const { data, error } = await supabase
            .from('user_games')
            .insert([{
                steam_id: steamId,
                game_id: appId,
                playtime: playtime,
                achievements_completed: achievementsComplete,
                last_played: lastPlayed,
            }]);
        if (error) {
            console.error("Error adding game to user list:", error);
            return null;
        }
        console.log("game added to user list");
        return data;
    } catch (error) {
        console.error("Error adding game to user list:", error);
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
    export async function addFriendToDatabase(userSteamId, friendSteamId, friendName) {
        try {
            const { data, error } = await supabase
                .from('user_friends')
                .insert([{
                    steam_id: userSteamId,
                    friend_id: friendSteamId,
                    friend_name: friendName,
                }]);
            if (error) {
                console.error("Error adding friend:", error);
                return null;
            }
            console.log("friend added to db");
            return data;
        } catch (error) {
            console.error("Error adding friend:", error);
            return null;
        }
    }

    // Get friends from FRIENDS table
    export async function getFriendsFromDatabase(userSteamId) {
        try {
            const { data, error } = await supabase
                .from('user_friends')
                .select('*')
                .eq('steam_id', userSteamId);
            
            if (error) {
                console.error("Error fetching friends:", error);
                return null;
            }
            return data;
        } catch (error) {
            console.error("Error fetching friends:", error);
            return null;
        }
    }

    // Update friend in FRIENDS table

// PLAYTIME SNAPSHOTS (immutable records of playtime at a specific date)

    // Add playtime snapshot to PLAYTIME_SNAPSHOTS table

    // Remove playtime snapshot from PLAYTIME_SNAPSHOTS table

    // Get playtime snapshots from PLAYTIME_SNAPSHOTS tables


