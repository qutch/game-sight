/**
 * @module SteamService
 * @description Wrapper for the Steam Web API. All functions make HTTP requests
 * to Steam endpoints and return parsed response data.
 */

// PLAYER SECTION

/**
 * Maps Steam persona state codes to readable status strings.
 * @constant {Object.<number, string>}
 */
const STATUS_MAP = {
    0: "offline",
    1: "online",
    2: "busy",
    3: "away",
    4: "snooze"
};


/**
 * Get a player's current status (online, offline, in-game, etc.).
 * @async
 * @param {string} steamId - The player's 64-bit Steam ID.
 * @returns {Promise<{status: string, game?: string, gameId?: string}>} The player's status and current game info if in-game.
 * @throws {Error} If the Steam API request fails.
 */
export async function getPlayerStatus(steamId) {

    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Code: ' + response.status + ' | Steam API request failed for getPlayerSummary: ' + steamId);
    }

    const data = await response.json();
    const playerData = data.response.players[0];
    var returnList = {};

    // Check if the player's status is in there
    // If 'gamextrainfo' is present, it means the player is currently in a game
    if ("gameextrainfo" in playerData && "gameid" in playerData) {
        returnList.status = "ingame";
        returnList.game = playerData.gameextrainfo;
        returnList.gameId = playerData.gameid;
    } else {
        returnList.status = STATUS_MAP[playerData.personastate] || "unknown";
    }

    // Convert dictionary to JSON string with indentation for better readability
    return returnList;
}

/**
 * Get a player's friend list.
 * @async
 * @param {string} steamId - The player's 64-bit Steam ID.
 * @returns {Promise<Array<{steamid: string, relationship: string, friend_since: number}>>} Array of friend objects.
 * @throws {Error} If the Steam API request fails.
 */
export async function getUserFriends(steamId) {
    const url = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getUserFriends: ' + steamId);
    }

    const data = await response.json();
    return data.friendslist.friends;
}


/**
 * Get a player's profile summary (avatar, name, profile URL, etc.).
 * @async
 * @param {string} steamId - The player's 64-bit Steam ID.
 * @returns {Promise<Object>} The player's profile data from Steam.
 * @throws {Error} If the Steam API request fails.
 */
export async function getPlayerSummary(steamId) {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Code: ' + response.status + ' | Steam API request failed for getPlayerSummary: ' + steamId);
    }

    const data = await response.json();
    return data.response.players[0];
}

/**
 * Get all games owned by a player, including free games.
 * @async
 * @param {string} steamId - The player's 64-bit Steam ID.
 * @returns {Promise<Array<{appid: number, name: string, playtime_forever: number}>>} Array of owned game objects.
 * @throws {Error} If the Steam API request fails.
 */
export async function getOwnedGames(steamId) {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getOwnedGames: ' + steamId);
    }

    const data = await response.json();
    return data.response.games;
}

/**
 * Calculate daily playtime for a specific game by comparing current playtime against the last saved snapshot.
 * @async
 * @param {string} steamId - The player's 64-bit Steam ID.
 * @param {number} appId - The Steam application ID of the game.
 * @returns {Promise<number>} The difference in playtime (minutes) since the last snapshot.
 * @throws {Error} If the Steam API request fails or the game is not in recently played.
 */
export async function getDailyPlaytimeForGame(steamId, appId) {
    const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getDailyPlaytimeForGame: ' + steamId);
    }

    // 1. Check current playtime stats for the game
    const data = await response.json();
    const currentPlaytime = data.response.games.find(game => game.appid === appId)?.playtime_forever || -1;

    if (currentPlaytime < 0) {
        throw new Error('Game with appId ' + appId + ' not found in recently played games for user ' + steamId);
    }

    // 2. Compare to the saved playtime stats for the game
    const dailyPlaytime = currentPlaytime - (await getSavedPlaytime(steamId, appId));

    // 3. Calculate the difference to get the daily playtime
    return dailyPlaytime;
}



// GAME SECTION

/**
 * Get detailed store page data for a game.
 * @async
 * @param {number|string} appId - The Steam application ID.
 * @returns {Promise<Object>} The game's store page data (description, images, pricing, etc.).
 * @throws {Error} If the Steam API request fails.
 */
export async function getGameDetails(appId) {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getGameDetails: ' + appId);
    }

    const data = await response.json();
    return data[appId].data;
}

/**
 * Get the Steam app catalog list (paginated).
 * @async
 * @param {Object} [queryParams={}] - Optional query parameters for filtering/pagination.
 * @returns {Promise<Object>} The paginated app list response from Steam.
 * @throws {Error} If the Steam API request fails.
 */
export async function getAppList(queryParams = {}) {
    const baseUrl = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${process.env.STEAM_API_KEY}`;
    const extraParams = new URLSearchParams(queryParams).toString();
    const url = extraParams ? `${baseUrl}&${extraParams}` : baseUrl;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getAppList');
    }

    const data = await response.json();
    return data.response;
}


// ACHIEVEMENTS SECTION

/**
 * Get all achievements defined for a game.
 * @async
 * @param {number|string} appId - The Steam application ID.
 * @returns {Promise<Array<Object>>} Array of achievement definition objects.
 * @throws {Error} If the Steam API request fails.
 */
export async function getGameAchievements(appId) {
    const url = `https://api.steampowered.com/IPlayerService/GetGameAchievements/v1/?key=${process.env.STEAM_API_KEY}&appid=${appId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getGameAchievements: ' + appId);
    }

    const data = await response.json();
    return data.response.achievements;
}

/**
 * Get a player's achievement progress for a specific game.
 * @async
 * @param {string} steamId - The player's 64-bit Steam ID.
 * @param {number|string} appId - The Steam application ID.
 * @returns {Promise<Object>} The player's achievement stats for the game.
 * @throws {Error} If the Steam API request fails.
 */
export async function getPlayerAchievements(steamId, appId) {
    const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&appid=${appId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getPlayerAchievements: ' + steamId);
    }

    const data = await response.json();
    return data.playerstats;
}

/**
 * Get top achievements across multiple games for a player.
 * @async
 * @param {string} steamId - The player's 64-bit Steam ID.
 * @param {Array<number|string>} appIds - Array of Steam application IDs.
 * @returns {Promise<Array<Object>>} Array of game objects with their top achievements.
 * @throws {Error} If the Steam API request fails.
 */
export async function getTopAchievementsForGames(steamId, appIds) {
    const appIdParams = appIds.map(id => `appids=${id}`).join('&');
    const url = `https://api.steampowered.com/IPlayerService/GetTopAchievementsForGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&${appIdParams}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getTopAchievementsForGames: ' + steamId);
    }

    const data = await response.json();
    return data.response.games;
}

/**
 * Get global achievement unlock percentages for a game. Public endpoint — no API key needed.
 * @async
 * @param {number|string} appId - The Steam application ID.
 * @returns {Promise<Array<{name: string, percent: number}>>} Array of achievements with their global unlock percentages.
 * @throws {Error} If the Steam API request fails.
 */
export async function getGlobalAchievementPercentages(appId) {
    const url = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${appId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getGlobalAchievementPercentages: ' + appId);
    }

    const data = await response.json();
    return data.achievementpercentages.achievements;
}
