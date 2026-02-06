// PLAYER SECTION

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
