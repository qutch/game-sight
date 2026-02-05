// Import packages
import express from 'express';

import { getUserFriends, getPlayerSummary } from '../services/SteamService.js';

// Constants
const router = express.Router();


// Routers
router.get('/player/:steamId', async (req, res) => {
    try {
        const data = await getPlayerSummary(req.params.steamId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.get('/friends/:steamId', async (req, res) => {
    try {
        const data = await getUserFriends(req.params.steamId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

export default router;