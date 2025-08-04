import { IComplaint } from "../../models/interfaces/complaint.interface";
import { IComplaintRepository } from "../interfaces/complaint.interface";
import Complaint from "../../models/implementations/complaintSchema"

export class ComplaintRepository implements IComplaintRepository{
    async createComplaint(data: Partial<IComplaint>): Promise<IComplaint | null> {
        return await Complaint.create(data)
    }

    async getComplaints(): Promise<IComplaint[] | null> {
        return await Complaint.find({}).populate("userId").populate("targetId")
    }

    async updateComplaint(id:string,status: string, response: string): Promise<IComplaint | null> {
        return await Complaint.findByIdAndUpdate(id,{
            $set:{status:status,response:response}
        },{new:true})
    }
}