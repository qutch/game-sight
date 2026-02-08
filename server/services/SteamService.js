// PLAYER SECTION


// Get player status (online, offline, in-game)
export async function getPlayerStatus(steamId) {
    // 0: Offline, 1: Online, 2: Busy, 3: Away, 4: Snooze
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Code: ' + response.status + ' | Steam API request failed for getPlayerSummary: ' + steamId);
    }

    const data = await response.json();
    var returnList = {};

    // Check if the player's status is in there
    // If 'gamextrainfo' is present, it means the player is currently in a game
    if ("gameextrainfo" in data.response.players[0] && "gameid" in data.response.players[0]) {
        returnList.status = "ingame";
        returnList.game = data.response.players[0].gameextrainfo;
        returnList.gameId = data.response.players[0].gameid;
    } else {
        if (data.response.players[0].personastate === 0) {
            returnList.status = "offline";
        } else if (data.response.players[0].personastate === 1) {
            returnList.status = "online";
        } else if (data.response.players[0].personastate === 2) {
            returnList.status = "busy";
        } else if (data.response.players[0].personastate === 3) {
            returnList.status = "away";
        } else if (data.response.players[0].personastate === 4) {
            returnList.status = "snooze";
        } else {
            returnList.status = "unknown";
        }
    }

    // Convert dictionary to JSON string with indentation for better readability
    return JSON.stringify(returnList, null, 2);
}

// Get player's friend list
export async function getUserFriends(steamId) {
    const url = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getUserFriends: ' + steamId);
    }

    const data = await response.json();
    return data.friendslist.friends;
}


// Get player summaries (profile info)
export async function getPlayerSummary(steamId) {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Code: ' + response.status + ' | Steam API request failed for getPlayerSummary: ' + steamId);
    }

    const data = await response.json();
    return data.response.players[0];
}

// Get owned games for a player
export async function getOwnedGames(steamId) {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getOwnedGames: ' + steamId);
    }

    const data = await response.json();
    return data.response.games;
}

// Get daily playtime for a specific game
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

// Get daily playtime for whole library



// GAME SECTION

// Get game details
export async function getGameDetails(appId) {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getGameDetails: ' + appId);
    }

    const data = await response.json();
    return data[appId].data;
}

// Get the Steam app catalog list (paginated)
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

// Get achievements defined for a game
export async function getGameAchievements(appId) {
    const url = `https://api.steampowered.com/IPlayerService/GetGameAchievements/v1/?key=${process.env.STEAM_API_KEY}&appid=${appId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getGameAchievements: ' + appId);
    }

    const data = await response.json();
    return data.response.achievements;
}

// Get a player's achievements for a specific game
export async function getPlayerAchievements(steamId, appId) {
    const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&appid=${appId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getPlayerAchievements: ' + steamId);
    }

    const data = await response.json();
    return data.playerstats;
}

// Get top achievements across multiple games for a player
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

// Get global achievement unlock percentages for a game (public, no API key needed)
export async function getGlobalAchievementPercentages(appId) {
    const url = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${appId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Steam API request failed for getGlobalAchievementPercentages: ' + appId);
    }

    const data = await response.json();
    return data.achievementpercentages.achievements;
}
