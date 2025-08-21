import image from "../../assets/e learning.jpg";
import {
  FaChalkboardTeacher,
  FaChartLine,
  FaCertificate,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaChalkboardTeacher />,
      title: "Expert-Led Courses",
      description:
        "Learn from top educators and industry leaders with real-world experience.",
    },
    {
      icon: <FaChartLine />,
      title: "Progress & Reports",
      description:
        "Keep track of your goals and achievements with smart progress tracking tools.",
    },
    {
      icon: <FaCertificate />,
      title: "Verified Certifications",
      description:
        "Earn professional certificates to boost your resume and credibility.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Registered Learners" },
    { number: "500+", label: "Expert Instructors" },
    { number: "50K+", label: "Courses Completed" },
    { number: "4.9/5", label: "User Satisfaction" },
  ];

  const cta =
    "bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white py-2 px-6 rounded-full text-sm sm:text-base font-medium transition-transform hover:-translate-y-1 shadow-lg";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative">
      <div className="fixed top-[10%] left-[10%] w-2.5 h-2.5 bg-cyan-400/30 rounded-full animate-pulse" />
      <div
        className="fixed top-[20%] right-[20%] w-4 h-4 bg-fuchsia-400/30 rounded-full animate-bounce"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="fixed bottom-[30%] left-[30%] w-2 h-2 bg-cyan-400/30 rounded-full animate-ping"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="fixed bottom-[20%] right-[10%] w-3 h-3 bg-fuchsia-400/30 rounded-full animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <Navbar />

      <section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-5 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <h1
              className="text-5xl sm:text-6xl font-extrabold mb-6
                   bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-600
                   bg-clip-text text-transparent animate-pulse"
              style={{
                animationDuration: "3s",
                animationIterationCount: "infinite",
              }}
            >
              Empower Your Future
              <br className="hidden sm:block" /> With{" "}
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text font-black italic drop-shadow-lg">
                Learn At
              </span>
            </h1>

            <p className="text-lg sm:text-xl mb-10 text-slate-400 max-w-md">
              Discover top-notch courses, track your progress, and earn
              certificates. Flexible, affordable, and powerful learning — all in
              one platform.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/users/courses")}
                className={cta + " py-4 px-10 text-base"}
              >
                Explore Courses
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div
              className="relative w-full h-80 sm:h-[28rem] bg-white/5 backdrop-blur
                   ring-1 ring-white/10 rounded-3xl overflow-hidden shadow-xl
                   transform-gpu"
            >
              <img
                src={image}
                alt="Online Learning"
                className="w-full h-full object-cover"
              />

              <div
                className="pointer-events-none absolute inset-0 -translate-x-full
                     bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-center text-4xl font-bold mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 transition-transform duration-500 cursor-pointer overflow-hidden hover:-translate-y-3 hover:scale-105"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                <div
                  className="w-[60px] h-[60px] bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-full flex items-center justify-center text-2xl mb-4"
                  style={{ animationDuration: "10s" }}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl mb-2 font-semibold">{f.title}</h3>
                <p className="text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl mb-8 font-bold">Trusted by Thousands</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                  {s.number}
                </div>
                <div className="text-lg text-slate-400 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="register" className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-5">
          <p className="mb-6 text-slate-400">
            Learning has never been this easy, accessible, and impactful.
          </p>
            <button
              onClick={() => navigate("/users/courses")}
              className={cta + " py-4 px-10 text-base"}
            >
              Explore Courses
            </button>
        </div>
      </section>

      <footer className="bg-slate-800 py-3 px-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Learn At. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
