import React, { useEffect, useState } from "react";
import adminApi from "../services/adminApiService";
import instructorApi from "../services/instructorApiService";
import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";

interface Transaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: string;
}

interface WalletProps {
  role: "admin" | "instructors";
}

const Earnings: React.FC<WalletProps> = ({ role }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 2;
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchWallet = async () => {
      const selectedApi = role === "admin" ? adminApi : instructorApi;
      const res = await selectedApi.get<{
        transactions: [];
        balance: number;
        totalPages: number;
      }>(`/${role}/wallet?page=${currentPage}&limit=${itemsPerPage}`);
      setTransactions(res.data.transactions || []);
      console.log(transactions)
      setTotalPages(res.data.totalPages);
      setBalance(res.data.balance);
    };
    fetchWallet();
  }, [role, currentPage, itemsPerPage]);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1");
    setCurrentPage(pageParam);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className="p-6 bg-white md:p-10 max-w-4xl mx-auto h-full overflow-y-hidden">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-md mb-10 w-full max-w-sm">
        <div className="text-lg font-medium mb-2">
          {" "}
          {role === "admin" ? "Admin Wallet" : "Instructor Wallet"}
        </div>
        <div className="text-sm mb-4 tracking-widest">**** **** **** 8529</div>
        <div className="text-2xl font-semibold mb-1">₹{balance.toFixed(2)}</div>
        <div className="text-xs">Valid Thru: 12/29</div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>

        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className={`p-4 rounded-lg shadow-sm border-l-4 ${
                  tx.type === "credit"
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">₹{tx.amount.toFixed(2)}</span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      tx.type === "credit"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{tx.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>
        ) : (
          <p className="text-gray-500 mt-6 text-center">
            No transactions found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Earnings;
