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
    "bg-green-500 hover:bg-green-400 text-black py-2 px-6 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-green-500/20";

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "0.3cm 0.3cm",
        }}
      />

      <Navbar />

      <section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-5 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-white">
              Empower Your Future
              <br className="hidden sm:block" /> With{" "}
              <span className="text-green-400 font-black italic drop-shadow-lg">
                Learn At
              </span>
            </h1>

            <p className="text-lg sm:text-xl mb-10 text-neutral-400 max-w-md">
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
                <div className="absolute inset-0 bg-green-400/0 group-hover:bg-green-400/5 transition-colors duration-500" />
                <div
                  className="w-[60px] h-[60px] bg-green-500 text-black rounded-full flex items-center justify-center text-2xl mb-4"
                  style={{ animationDuration: "10s" }}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl mb-2 font-semibold">{f.title}</h3>
                <p className="text-neutral-400">{f.description}</p>
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
                <div className="text-5xl font-extrabold text-green-400">
                  {s.number}
                </div>
                <div className="text-lg text-neutral-400 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="register" className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-5">
          <p className="mb-6 text-neutral-400">
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

      <footer className="bg-black border-t border-white/10 py-3 px-4 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} Learn At. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;