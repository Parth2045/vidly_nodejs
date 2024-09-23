"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(req, res, next) {
    // 401 Unauthorized
    // 403 Forbidden 
    if (!req.user.isAdmin)
        return res.status(403).send('Access denied.');
    next();
}
