import { useEffect, useState } from "react";
import userApi from "../../services/userApiService";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";

interface Course {
  _id: string;
  title: string;
}

interface Orders {
  _id: string;
  course: Course;
  purchasedAt: string;
  amount: number;
  status:string
}

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Orders[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage=6

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userApi.get<{purchases:Orders[],total:number,totalPages:number}>(`/users/purchase-history?page=${currentPage}&limit=${itemsPerPage}`);
        setPurchases(res.data.purchases);
        setTotalPages(res.data.totalPages)
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-full bg-black text-white p-6">
      <div className="max-w-5xl mx-auto bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Purchase History</h2>

        {purchases.length === 0 ? (
          <p className="text-gray-400">
            You haven't purchased any courses yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-700">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left border-b border-gray-600">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-600">
                    Course
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-600">
                    Purchase Date
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-600">
                    Price (₹)
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase._id} className="hover:bg-gray-800">
                    <td className="px-4 py-2 border-b border-gray-700">
                      {purchase._id}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {purchase.course.title}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {new Date(purchase.purchasedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      ₹{purchase.amount}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
    </div>
  );
}
