import { IComplaint } from "../../models/interfaces/complaint.interface";
import { IComplaintRepository } from "../interfaces/complaint.interface";
import Complaint from "../../models/implementations/complaintSchema";

export class ComplaintRepository implements IComplaintRepository {
  async createComplaint(data: Partial<IComplaint>): Promise<IComplaint | null> {
    return await Complaint.create(data);
  }

  async getComplaints(
    page: number,
    limit: number
  ): Promise<{ complaints: IComplaint[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      Complaint.find({})
        .populate("userId")
        .populate("targetId")
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      complaints,
      total,
      totalPages,
    };
  }

  async updateComplaint(
    id: string,
    status: string,
    response: string
  ): Promise<IComplaint | null> {
    return await Complaint.findByIdAndUpdate(
      id,
      {
        $set: { status: status, response: response },
      },
      { new: true }
    );
  }
}
