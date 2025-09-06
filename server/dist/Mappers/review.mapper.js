"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toReviewDTOList = exports.toReviewDTO = void 0;
const toReviewDTO = (review) => ({
    _id: review._id?.toString(),
    course: review.course,
    user: review.user,
    rating: review.rating,
    text: review.text,
    isHidden: review.isHidden,
    createdAt: review.createdAt
});
exports.toReviewDTO = toReviewDTO;
const toReviewDTOList = (reviews) => {
    return reviews.map(exports.toReviewDTO);
};
exports.toReviewDTOList = toReviewDTOList;
