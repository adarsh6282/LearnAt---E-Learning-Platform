"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toReviewDTOList = exports.toReviewDTO = void 0;
const toReviewDTO = (review) => {
    var _a;
    return ({
        _id: (_a = review._id) === null || _a === void 0 ? void 0 : _a.toString(),
        course: review.course,
        user: review.user,
        rating: review.rating,
        text: review.text,
        isHidden: review.isHidden,
        createdAt: review.createdAt
    });
};
exports.toReviewDTO = toReviewDTO;
const toReviewDTOList = (reviews) => {
    return reviews.map(exports.toReviewDTO);
};
exports.toReviewDTOList = toReviewDTOList;
