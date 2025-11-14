import { useEffect, useState } from "react";
import { errorToast } from "../../components/Toast";
import { useAuth } from "../../hooks/useAuth";
import { getCertificatesS } from "../../services/user.services";
import type { AxiosError } from "axios";
import { X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";

interface Certificate {
  _id: string;
  user: string;
  course: string;
  courseTitle: string;
  certificateUrl: string;
  issuedDate: string;
}

const UserCertificates = () => {
  const { authUser } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 1;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  useEffect(() => {
    if (!authUser) return;

    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const res = await getCertificatesS(authUser._id!,currentPage,itemsPerPage);
        setCertificates(res.data.certificates);
        setTotalPages(res.data.totalPages)
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        errorToast(error.response?.data?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [authUser,currentPage,itemsPerPage]);

  if (loading) return <p>Loading certificates...</p>;

  if (!certificates.length) return <p>No certificates found.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Certificates</h2>
      <ul className="space-y-4">
        {certificates.map((cert) => (
          <li key={cert._id} className="bg-white/10 p-4 rounded-md">
            <p className="font-semibold">{cert.courseTitle}</p>
            <p className="text-sm text-slate-400">
              Issued on: {new Date(cert.issuedDate).toLocaleDateString()}
            </p>
            <button
              onClick={() => {
                setSelectedPdf(cert.certificateUrl);
                setIsModalOpen(true);
              }}
              className="text-cyan-400 hover:underline"
            >
              View Certificate
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center mt-30 justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[70vh] shadow-lg overflow-hidden relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedPdf(null);
              }}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 z-10"
            >
              <X size={24} />
            </button>

            <iframe
              src={`${selectedPdf}#navpanes=0&scrollbar=0`}
              title="Certificate PDF"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UserCertificates;
