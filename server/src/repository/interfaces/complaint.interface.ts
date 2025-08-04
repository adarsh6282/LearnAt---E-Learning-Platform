import { IComplaint } from "../../models/interfaces/complaint.interface";

export interface IComplaintRepository{
    createComplaint(data:Partial<IComplaint>):Promise<IComplaint|null>,
    getComplaints():Promise<IComplaint[]|null>,
    updateComplaint(id:string,status:string,response:string):Promise<IComplaint|null>
}