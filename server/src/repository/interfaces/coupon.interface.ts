import { ICoupon } from "../../models/interfaces/coupon.interface";

export interface ICouponRepository{
    addCoupon(courseId:string,code: string, discount: number, expiresAt: Date, maxUses: number,instructorId:string):Promise<ICoupon|null>
    findCouponByCode(code:string):Promise<ICoupon|null>
    findCouponsForCourse(courseId:string):Promise<ICoupon[]|null>
    updateUsedCount(couponCode:string):Promise<ICoupon|null>
    getCouponsForInstructors(instructorId:string):Promise<ICoupon[]|null>
    updateCoupon(id:string,code:string,discount:number,expiresAt:string,maxUses:number):Promise<ICoupon|null>
    findCouponById(id:string):Promise<ICoupon|null>
}