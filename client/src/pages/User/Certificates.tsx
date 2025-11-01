import { useEffect, useState } from "react";
import { errorToast } from "../../components/Toast";
import { useAuth } from "../../hooks/useAuth";
import { getCertificatesS } from "../../services/user.services";
import type { AxiosError } from "axios";

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authUser) return;

    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const res = await getCertificatesS(authUser._id!);
        setCertificates(res.data);
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        errorToast(error.response?.data?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [authUser]);

  console.log(certificates)

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
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              View Certificate
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserCertificates;
