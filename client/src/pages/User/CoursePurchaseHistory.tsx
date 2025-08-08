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
  status: string;
}

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Orders[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 6;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userApi.get<{
          purchases: Orders[];
          total: number;
          totalPages: number;
        }>(`/users/purchase-history?page=${currentPage}&limit=${itemsPerPage}`);
        setPurchases(res.data.purchases);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto py-16 px-4 relative z-10">
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Purchase History
          </h2>

          {purchases.length === 0 ? (
            <p className="text-slate-400">
              You haven't purchased any courses yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-cyan-400/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-900/60 to-fuchsia-900/60">
                    <th className="px-4 py-2 text-left border-b border-cyan-400/10">
                      Order ID
                    </th>
                    <th className="px-4 py-2 text-left border-b border-cyan-400/10">
                      Course
                    </th>
                    <th className="px-4 py-2 text-left border-b border-cyan-400/10">
                      Purchase Date
                    </th>
                    <th className="px-4 py-2 text-left border-b border-cyan-400/10">
                      Price (₹)
                    </th>
                    <th className="px-4 py-2 text-left border-b border-cyan-400/10">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr
                      key={purchase._id}
                      className="hover:bg-cyan-400/10 transition"
                    >
                      <td className="px-4 py-2 border-b border-cyan-400/10">
                        {purchase._id}
                      </td>
                      <td className="px-4 py-2 border-b border-cyan-400/10">
                        {purchase.course.title}
                      </td>
                      <td className="px-4 py-2 border-b border-cyan-400/10">
                        {new Date(purchase.purchasedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-b border-cyan-400/10">
                        ₹{purchase.amount}
                      </td>
                      <td className="px-4 py-2 border-b border-cyan-400/10">
                        <span
                          className={`px-2 py-1 text-xs rounded font-semibold
                        ${
                          purchase.status === "Completed"
                            ? "bg-gradient-to-r from-green-400 to-cyan-500 text-white"
                            : "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white"
                        }
                      `}
                        >
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

        {/* Animations */}
        <style>
          {`
        @keyframes blob1 {
          0%, 100% { transform: translateY(0) scale(1);}
          50% { transform: translateY(-30px) scale(1.1);}
        }
        .animate-blob1 { animation: blob1 12s ease-in-out infinite; }
        @keyframes blob2 {
          0%, 100% { transform: translateY(0) scale(1);}
          50% { transform: translateY(30px) scale(1.1);}
        }
        .animate-blob2 { animation: blob2 14s ease-in-out infinite; }
        `}
        </style>
      </div>
    </div>
  );
}
