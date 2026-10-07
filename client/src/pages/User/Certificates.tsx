import { useEffect, useState } from "react";
import { errorToast } from "../../components/Toast";
import { useAuth } from "../../hooks/useAuth";
import { getCertificatesS } from "../../services/user.services";
import type { AxiosError } from "axios";
import { Award, ScrollText, Eye, X } from "lucide-react";
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
        const res = await getCertificatesS(
          authUser._id!,
          currentPage,
          itemsPerPage,
        );
        setCertificates(res.data.certificates);
        setTotalPages(res.data.totalPages);
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        errorToast(error.response?.data?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [authUser, currentPage, itemsPerPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse text-green-400 text-lg">
          Loading certificates...
        </div>
      </div>
    );
  }

  if (!certificates.length) {
    return (
      <div className="text-center py-16 bg-black/20 rounded-2xl border border-white/5">
        <Award className="mx-auto h-12 w-12 text-green-400 mb-4" />
        <h3 className="mt-2 text-xl font-bold text-white">
          No certificates yet
        </h3>
        <p className="mt-1 text-sm text-neutral-400">
          Complete courses to earn your certificates here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <Award className="text-green-400" size={24} />
        <h2 className="text-2xl font-bold text-white">
          <span className="font-ornate text-4xl text-green-400 font-black italic">
            Certificates
          </span>
        </h2>
      </div>

      <div className="space-y-5">
        {certificates.map((cert) => (
          <div
            key={cert._id}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-2xl hover:ring-green-500/30 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4 sm:mb-0">
              <div className="p-3 bg-black/30 rounded-xl ring-1 ring-white/10">
                <ScrollText className="text-green-400" size={24} />
              </div>

              <div>
                <p className="font-bold text-white text-lg">
                  {cert.courseTitle}
                </p>
                <p className="text-sm text-neutral-400 mt-1 flex items-center gap-2">
                  <Award size={14} className="text-neutral-500" />
                  Issued on: {new Date(cert.issuedDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPdf(cert.certificateUrl);
                setIsModalOpen(true);
              }}
              className="group/btn relative inline-flex items-center justify-center py-2.5 px-6 text-sm font-semibold rounded-full overflow-hidden transition-all duration-300 ring-1 bg-white/5 text-neutral-300 ring-white/10 hover:ring-green-500/30 hover:-translate-y-0.5 self-start sm:self-center cursor-pointer"
            >
              <span className="absolute inset-0 bg-green-500 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></span>
              <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover/btn:text-black">
                <Eye size={16} />
                View Certificate
              </span>
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      )}

      {isModalOpen && selectedPdf && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
          onClick={() => {
            setIsModalOpen(false);
            setSelectedPdf(null);
          }}
        >
          <div
            className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-6xl h-[85vh] shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPdf(null);
                }}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 hover:text-green-400 transition-colors backdrop-blur ring-1 ring-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <iframe
              src={`${selectedPdf}#navpanes=0&scrollbar=0`}
              title="Certificate PDF"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCertificates;
