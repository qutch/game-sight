// Import packages
import express from 'express';
import dotenv from 'dotenv';
import steamRoutes from '../server/routes/steam.js';

// Dot env config
dotenv.config({path: '../.env'});

// Constants
const app = express()
const PORT = process.env.PORT || 5150

app.use(express.json());
app.use('/api/steam', steamRoutes);

// Routers
app.get('/', (req, res) => {
    res.send("hey")
})

app.get('/health', (req, res) => {
    res.send("ok")
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
