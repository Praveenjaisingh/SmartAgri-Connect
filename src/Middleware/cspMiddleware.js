const helmet = require("helmet");

const cspMiddleware = helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'"
        ],
        styleSrc: [
            "'self'",
            "'unsafe-inline'"
        ],
        imgSrc: [
            "'self'",
            "data:",
            "blob:"
        ],
        fontSrc: [
            "'self'",
            "data:"
        ],
        connectSrc: [
            "'self'"
        ],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []
    }
});

module.exports = cspMiddleware;