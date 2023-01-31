const express = require('express');
const cookieRouter = require('./cookies/cookies.router');
const sessionRouter = require('./session/session.router');
const router = express.Router();

router.get("/health", (_req, res) => {
    res.status(200).json({
        message: "Server is up and running",
        health: "OK",
    });
});

router.get('/info', (_req, res) => {
    res.status(200).json({
        directory: process.cwd(),
        IDdelproceso: process.pid,
        nodeVersion: process.version,
        TitulodelProceso: process.title,
        plataforma: process.platform,
        MemoryUse: process.memoryUsage()
    })
})

router.use('/cookies', cookieRouter)

router.use('/session', sessionRouter)

module.exports = router; 