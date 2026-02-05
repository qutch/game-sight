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