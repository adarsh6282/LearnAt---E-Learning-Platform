"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLivesessionDTO = void 0;
const toLivesessionDTO = (ls) => {
    return {
        _id: ls._id?.toString(),
        isLive: ls.isLive
    };
};
exports.toLivesessionDTO = toLivesessionDTO;
