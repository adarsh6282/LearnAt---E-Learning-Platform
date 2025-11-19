import { ICoupon } from "../../models/interfaces/coupon.interface";
import { ICouponRepository } from "../interfaces/coupon.interface";
import Coupon from "../../models/implementations/couponModel";

export class CouponRepository implements ICouponRepository {
  async addCoupon(
    courseId: string,
    code: string,
    discount: number,
    expiresAt: Date,
    maxUses: number
  ): Promise<ICoupon | null> {
    return await Coupon.create({
      courseId,
      code: code.toUpperCase(),
      discount,
      expiresAt,
      maxUses,
    });
  }

  async findCouponByCode(code: string): Promise<ICoupon | null> {
    return await Coupon.findOne({ code: code.toUpperCase() });
  }

  async findCouponsForCourse(courseId: string): Promise<ICoupon[] | null> {
    return await Coupon.find({ courseId: courseId });
  }

  async updateUsedCount(couponCode: string): Promise<ICoupon | null> {
    return await Coupon.findOneAndUpdate(
      { code: couponCode },
      { $inc: { usedCount: 1 } },
      { new: true }
    );
  }
}
