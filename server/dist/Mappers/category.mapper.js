"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCategoryDTOList = exports.toCategoryDTO = void 0;
const toCategoryDTO = (category) => ({
    _id: category._id?.toString(),
    name: category.name,
    isDeleted: category.isDeleted
});
exports.toCategoryDTO = toCategoryDTO;
const toCategoryDTOList = (categories) => {
    return categories.map(exports.toCategoryDTO);
};
exports.toCategoryDTOList = toCategoryDTOList;
