const express = require('express');
const cors = require('cors');
const path = require("path");

const userRoutes = require('./Routes/userRoutes');
const errorHandler = require("./Middleware/errorHandler");
// const cspMiddleware = require("./Middleware/csp");
const rateLimiter = require("./Middleware/rateLimiter");

const app = express();

// ─── Security: CSP + security headers (apply before anything else) ────────────
// app.use(cspMiddleware);

// ─── Global rate limiter (100 req / 15 min per IP) ───────────────────────────
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "../public")));

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ status: false, errors: ["Route not found"] });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
