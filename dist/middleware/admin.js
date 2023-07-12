"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    // 401 Unauthorized
    // 403 Forbidden 
    if (!req.user.isAdmin)
        return res.status(403).send('Access denied.');
    next();
}
exports.default = default_1;
