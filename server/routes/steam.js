// Import packages
import express from 'express';

import {
    getUserFriends,
    getPlayerSummary,
    getPlayerStatus,
    getGameDetails,
    getOwnedGames,
    getAppList,
    getGameAchievements,
    getPlayerAchievements,
    getTopAchievementsForGames,
    getGlobalAchievementPercentages
} from '../services/SteamService.js';

// Constants
const router = express.Router();

// STEAM DATA ENDPOINTS
router.get('/player/:steamId', async (req, res) => {
    try {
        const data = await getPlayerSummary(req.params.steamId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.get('/player/status/:steamId', async (req, res) => {
    try {
        const data = await getPlayerStatus(req.params.steamId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/friends/:steamId', async (req, res) => {
    try {
        const data = await getUserFriends(req.params.steamId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.get('/owned-games/:steamId', async (req, res) => {
    try {
        const data = await getOwnedGames(req.params.steamId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.get('/game/:appId', async (req, res) => {
    try {
        const data = await getGameDetails(req.params.appId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.get('/apps', async (req, res) => {
    try {
        const data = await getAppList(req.query);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.get('/game-achievements/:appId', async (req, res) => {
    try {
        const data = await getGameAchievements(req.params.appId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.get('/player-achievements/:steamId/:appId', async (req, res) => {
    try {
        const data = await getPlayerAchievements(req.params.steamId, req.params.appId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.get('/top-achievements/:steamId', async (req, res) => {
    try {
        const appIds = req.query.appIds ? req.query.appIds.split(',') : [];
        const data = await getTopAchievementsForGames(req.params.steamId, appIds);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.get('/global-achievements/:appId', async (req, res) => {
    try {
        const data = await getGlobalAchievementPercentages(req.params.appId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

export default router;