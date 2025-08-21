import { useEffect } from "react";
import heroImage from "../../assets/publicImage.jpg";
import { FaPlayCircle, FaUsers, FaLightbulb } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PublicLandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("usersToken");

  useEffect(() => {
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [token, navigate]);

  const features = [
    {
      icon: <FaPlayCircle />,
      title: "Learn at Your Pace",
      description:
        "No deadlines, no stress — access your lessons anytime, anywhere.",
    },
    {
      icon: <FaUsers />,
      title: "Join a Global Community",
      description:
        "Collaborate with learners and mentors from over 50 countries.",
    },
    {
      icon: <FaLightbulb />,
      title: "Hands-on Experience",
      description:
        "Work on real-world projects to gain practical, job-ready skills.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 lg:pt-28 flex flex-col lg:flex-row items-center gap-12">
        {/* Left text */}
        <div className="flex-1">
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Unlock Knowledge.  
            <br /> Build Your Future.
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Step into a world of limitless learning. From coding to design,  
            we bring you the tools, community, and confidence to achieve your goals.  
            Learn the skills that matter — the way you want.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/users/register")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition-transform hover:-translate-y-1"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/users/login")}
              className="bg-transparent border border-white/30 hover:border-white/60 px-6 py-3 rounded-lg font-semibold transition-transform hover:-translate-y-1"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={heroImage}
              alt="Learning Illustration"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="absolute -z-10 -top-10 -left-10 w-60 h-60 bg-cyan-500/20 blur-3xl rounded-full"></div>
          <div className="absolute -z-10 -bottom-10 -right-10 w-60 h-60 bg-fuchsia-500/20 blur-3xl rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/5 p-8 rounded-2xl text-center border border-white/10 hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-4 text-cyan-400">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 py-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Learn At. All rights reserved.
      </footer>
    </div>
  );
};

export default PublicLandingPage;
