import { IComplaint } from "../../models/interfaces/complaint.interface";

export interface IComplaintRepository{
    createComplaint(data:Partial<IComplaint>):Promise<IComplaint|null>,
    getComplaints(page:number,limit:number):Promise<{complaints:IComplaint[],total:number,totalPages:number}>,
    updateComplaint(id:string,status:string,response:string):Promise<IComplaint|null>
}