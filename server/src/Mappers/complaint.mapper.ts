import { ComplaintDTO } from "../DTO/complaint.dto";
import { IComplaint } from "../models/interfaces/complaint.interface";

export const toComplaintDTO = (complaint: IComplaint): ComplaintDTO => ({
  _id: complaint._id.toString(),
  userId: complaint.userId,
  type: complaint.type,
  subject: complaint.subject,
  message: complaint.message,
  targetId: complaint.targetId,
  status: complaint.status,
  response: complaint.response,
  createdAt:complaint.createdAt
});

export const toComplaintDTOList=(complaints:IComplaint[]):ComplaintDTO[]=>{
    return complaints.map(toComplaintDTO)
}