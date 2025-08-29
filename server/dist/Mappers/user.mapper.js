"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserDTOList = exports.toUserDTO = void 0;
const toUserDTO = (user) => ({
    _id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    isBlocked: user.isBlocked,
    profilePicture: user.profilePicture,
    role: user.role,
});
exports.toUserDTO = toUserDTO;
const toUserDTOList = (users) => (users.map(exports.toUserDTO));
exports.toUserDTOList = toUserDTOList;
