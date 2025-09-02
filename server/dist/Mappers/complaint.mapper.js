"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toComplaintDTOList = exports.toComplaintDTO = void 0;
const toComplaintDTO = (complaint) => ({
    _id: complaint._id.toString(),
    userId: complaint.userId,
    type: complaint.type,
    subject: complaint.subject,
    message: complaint.message,
    targetId: complaint.targetId,
    status: complaint.status,
    response: complaint.response,
    createdAt: complaint.createdAt
});
exports.toComplaintDTO = toComplaintDTO;
const toComplaintDTOList = (complaints) => {
    return complaints.map(exports.toComplaintDTO);
};
exports.toComplaintDTOList = toComplaintDTOList;
