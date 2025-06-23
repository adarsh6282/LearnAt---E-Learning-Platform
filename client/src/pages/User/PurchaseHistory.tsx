import React, { useEffect, useState } from "react";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

interface Purchase {
  _id: string;
  courseTitle: string;
  price: number;
  purchaseDate: string;
  paymentStatus: "completed" | "pending" | "failed";
  accessType: "lifetime" | "limited";
}

const dummyPurchases: Purchase[] = [
  {
    _id: "1",
    courseTitle: "MERN Stack Mastery",
    price: 1499,
    purchaseDate: "2025-06-18T10:30:00Z",
    paymentStatus: "completed",
    accessType: "lifetime",
  },
  {
    _id: "2",
    courseTitle: "React Beginner to Pro",
    price: 999,
    purchaseDate: "2025-05-10T14:00:00Z",
    paymentStatus: "completed",
    accessType: "lifetime",
  },
];

const PurchaseHistory: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setPurchases(dummyPurchases);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Purchase History</h1>

        {purchases.length === 0 ? (
          <div className="text-center mt-20">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">No purchases yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800 rounded-lg p-6 shadow-md flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold">
                    {order.courseTitle}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Purchased on{" "}
                    {new Date(order.purchaseDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Access: {order.accessType === "lifetime" ? "Lifetime" : "Limited"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">₹{order.price}</div>
                  <div className="flex items-center justify-end text-sm mt-1">
                    {order.paymentStatus === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-400 mr-1" />
                    )}
                    <span className={order.paymentStatus === "completed" ? "text-green-400" : "text-yellow-400"}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;