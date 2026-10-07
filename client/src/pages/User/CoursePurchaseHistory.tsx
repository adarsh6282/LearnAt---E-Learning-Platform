import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { purchaseHistoryS } from "../../services/user.services";
import { Receipt,HandCoins } from "lucide-react";

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
  const itemsPerPage = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await purchaseHistoryS(currentPage, itemsPerPage);
        setPurchases(res.data.purchases);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, [currentPage, itemsPerPage]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <Receipt className="text-green-400" size={24} />
        <h2 className="font-subtext text-3xl font-bold text-white">
          Purchase{" "}
          <span className="font-ornate text-green-400 font-black italic text-3xl">History</span>
        </h2>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-16 bg-black/20 rounded-2xl border border-white/5">
          <p className="text-neutral-400 text-lg">
            You haven't purchased any courses yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-neutral-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {purchases.map((purchase, index) => (
                <tr
                  key={purchase._id}
                  className="hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-neutral-300 font-mono">
                    {`ORD${String(
                      (currentPage - 1) * itemsPerPage + index + 1,
                    ).padStart(3, "0")}`}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {purchase.course.title}
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {new Date(purchase.purchasedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-neutral-300">
                    ₹{purchase.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ring-1 transition-all ${
                        purchase.status === "Completed"
                          ? "bg-green-500/10 text-green-400 ring-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
                      }`}
                    >
                      <HandCoins size={15} />
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}
