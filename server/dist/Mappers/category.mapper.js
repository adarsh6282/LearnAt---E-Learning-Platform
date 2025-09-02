"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCategoryDTOList = exports.toCategoryDTO = void 0;
const toCategoryDTO = (category) => {
    var _a;
    return ({
        _id: (_a = category._id) === null || _a === void 0 ? void 0 : _a.toString(),
        name: category.name,
        isDeleted: category.isDeleted
    });
};
exports.toCategoryDTO = toCategoryDTO;
const toCategoryDTOList = (categories) => {
    return categories.map(exports.toCategoryDTO);
};
exports.toCategoryDTOList = toCategoryDTOList;
