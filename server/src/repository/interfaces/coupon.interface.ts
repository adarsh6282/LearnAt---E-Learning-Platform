import { ICoupon } from "../../models/interfaces/coupon.interface";

export interface ICouponRepository{
    addCoupon(courseId:string,code: string, discount: number, expiresAt: Date, maxUses: number):Promise<ICoupon|null>
    findCouponByCode(code:string):Promise<ICoupon|null>
    findCouponsForCourse(courseId:string):Promise<ICoupon[]|null>
    updateUsedCount(couponCode:string):Promise<ICoupon|null>
}