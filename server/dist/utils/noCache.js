"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noCache = void 0;
const noCache = (req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
};
exports.noCache = noCache;
