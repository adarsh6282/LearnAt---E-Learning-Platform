"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminAccessToken = exports.setAdminAccessToken = exports.getInstructorAccessToken = exports.setInstructorAccessToken = exports.getUserAccessToken = exports.setUserAccessToken = void 0;
let userAccessToken = null;
let instructorAccessToken = null;
let adminAccessToken = null;
const setUserAccessToken = (token) => {
    userAccessToken = token;
};
exports.setUserAccessToken = setUserAccessToken;
const getUserAccessToken = () => userAccessToken;
exports.getUserAccessToken = getUserAccessToken;
const setInstructorAccessToken = (token) => {
    instructorAccessToken = token;
};
exports.setInstructorAccessToken = setInstructorAccessToken;
const getInstructorAccessToken = () => instructorAccessToken;
exports.getInstructorAccessToken = getInstructorAccessToken;
const setAdminAccessToken = (token) => {
    adminAccessToken = token;
};
exports.setAdminAccessToken = setAdminAccessToken;
const getAdminAccessToken = () => adminAccessToken;
exports.getAdminAccessToken = getAdminAccessToken;
