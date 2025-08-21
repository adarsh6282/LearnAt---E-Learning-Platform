import { IComplaint } from "../../models/interfaces/complaint.interface";
import { IComplaintRepository } from "../interfaces/complaint.interface";
import Complaint from "../../models/implementations/complaintSchema";

export class ComplaintRepository implements IComplaintRepository {
  async createComplaint(data: Partial<IComplaint>): Promise<IComplaint | null> {
    return await Complaint.create(data);
  }

  async getComplaints(
    page: number,
    limit: number,
    search: string,
    filter: string
  ): Promise<{ complaints: IComplaint[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const query: any = {};

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    if (filter) {
      query.status = filter;
    }

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate("userId", "name email")
        .populate("targetId", "title")
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(query),
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
