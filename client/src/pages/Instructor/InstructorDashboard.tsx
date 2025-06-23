import { useContext, useEffect, useState } from "react";
import { InstructorContext } from "../../context/InstructorContext";
import { reapplyS } from "../../services/instructor.services";
import { errorToast, successToast } from "../../components/Toast";

const InstructorDashboard = () => {
  const context=useContext(InstructorContext)
  if(!context){
    return "no context here"
  }
  const {instructor,getInstructorProfile}=context
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        await getInstructorProfile();
        
      } catch (err) {
        console.error("Error fetching instructor", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructor();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  const handleReapply = async () => {
    if (!resume) return errorToast("Please upload your resume");
    const formData = new FormData();
    formData.append("email",instructor?.email!)
    formData.append("resume", resume);
    try {
      await reapplyS(formData);
      successToast("Reapplication submitted!");
    } catch (err) {
      errorToast("Failed to submit reapplication");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (instructor?.isRejected && !instructor?.isVerified && instructor?.accountStatus==="rejected") {
    return (
      <div className="p-8 bg-yellow-50 min-h-screen">
        <h2 className="text-xl font-bold text-red-700 mb-4">Application Rejected</h2>
        <p className="text-gray-700 mb-4">
          Please upload a new resume to reapply.
        </p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mb-4"
        />

        <button
          onClick={handleReapply}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Reapplication
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
    </div>
  );
};

export default InstructorDashboard;
