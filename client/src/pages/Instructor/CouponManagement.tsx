import { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import {
  editCoupon,
  getInstructorCoupons,
} from "../../services/instructor.services";

interface Coupon {
  _id: string;
  courseId: string;
  discount: string;
  code: string;
  maxUses: number;
  usedCount: number;
  createdAt: string;
  expiresAt: string;
}

const InstructorCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    code: "",
    discount: "",
    maxUses: "",
    expiresAt: "",
  });

  const fetchCoupons = async () => {
    try {
      const res = await getInstructorCoupons();
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (couponId: string) => {
    try {
      //   await deleteCoupon(couponId);
      setCoupons((prev) => prev.filter((c) => c._id !== couponId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);

    setEditForm({
      code: coupon.code,
      discount: coupon.discount,
      maxUses: coupon.maxUses.toString(),
      expiresAt: coupon.expiresAt.split("T")[0],
    });

    setIsModalOpen(true);
  };

  const saveChanges = async () => {
    if (!selectedCoupon) return;

    try {
      const res = await editCoupon(
        selectedCoupon._id,
        editForm.code,
        editForm.discount,
        editForm.expiresAt,
        editForm.maxUses
      );
      const updatedCoupon = res.data;
      setCoupons((prev) =>
        prev.map((c) => (c._id === updatedCoupon._id ? updatedCoupon : c))
      );
    } catch (err) {
      console.log(err);
    }

    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <h1 className="text-2xl font-bold mb-6">Your Coupons</h1>

      {coupons.length === 0 ? (
        <p>No coupons found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Coupon Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Max Limit
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Used Limit
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Expiry
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td className="px-6 py-4">{coupon.courseId}</td>
                  <td className="px-6 py-4">{coupon.code}</td>
                  <td className="px-6 py-4">{coupon.maxUses}</td>
                  <td className="px-6 py-4">{coupon.usedCount}</td>

                  <td className="px-6 py-4">
                    {new Date(coupon.createdAt).toLocaleDateString()}
                  </td>

                  <td
                    className={`px-6 py-4 font-medium ${
                      new Date(coupon.expiresAt) < new Date()
                        ? "text-red-600"
                        : "text-green-700"
                    }`}
                  >
                    {new Date(coupon.expiresAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 flex justify-center space-x-3">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <MdEdit size={20} />
                    </button>

                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-400/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Coupon</h2>

            <label className="block mb-2 text-sm">Coupon Code</label>
            <input
              value={editForm.code}
              onChange={(e) =>
                setEditForm({ ...editForm, code: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <label className="block mb-2 text-sm">Discount</label>
            <input
              type="number"
              value={editForm.discount}
              onChange={(e) =>
                setEditForm({ ...editForm, discount: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <label className="block mb-2 text-sm">Max Uses</label>
            <input
              type="number"
              value={editForm.maxUses}
              onChange={(e) =>
                setEditForm({ ...editForm, maxUses: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <label className="block mb-2 text-sm">Expiry Date</label>
            <input
              type="date"
              value={editForm.expiresAt}
              onChange={(e) =>
                setEditForm({ ...editForm, expiresAt: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCoupons;
