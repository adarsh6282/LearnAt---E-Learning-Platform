import type React from "react";
import { Link } from "react-router-dom";

interface UserTutor {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

interface TableProps {
  data: UserTutor[];
  blockingId: string | null;
  onToggleBlock: (email: string, isBlocked: boolean) => void;
  showView?: boolean;
}

const Table: React.FC<TableProps> = ({
  data,
  blockingId,
  onToggleBlock,
  showView = false,
}) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
            Name
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
            Email
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
            Status
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
            Action
          </th>
          {showView && (
            <th className="px-6 py-4 text-left font-semibold text-gray-700">
              View
            </th>
          )}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {data.map((item) => (
          <tr key={item.email} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {item.name}
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {item.email}
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {item.isBlocked ? (
                <span className="text-red-600 font-semibold">Blocked</span>
              ) : (
                <span className="text-green-600 font-semibold">Active</span>
              )}
            </td>
            <td className="px-6 py-4 text-sm ">
              <button
                disabled={blockingId === item.email}
                onClick={() => onToggleBlock(item.email, item.isBlocked)}
                className={`px-3 py-1 rounded text-white ${item.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                {blockingId === item.email
                  ? "Processing..."
                  : item.isBlocked
                    ? "Unblock"
                    : "Block"}
              </button>
            </td>
            {showView && (
                <td>
                    <Link className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200" to={`/admin/tutor-view/${item._id}`}>View Details</Link>
                </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table