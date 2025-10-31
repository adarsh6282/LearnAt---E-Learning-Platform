import {
  FaRocket,
  FaUsers,
  FaGraduationCap,
  FaHeart,
  FaLightbulb,
  FaAward,
  FaGlobe,
  FaHandshake,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";

const AboutPage = () => {
  const values = [
    {
      icon: <FaLightbulb />,
      title: "Innovation",
      description:
        "Cutting-edge technology meets educational excellence to create transformative learning experiences.",
    },
    {
      icon: <FaUsers />,
      title: "Community",
      description:
        "A thriving ecosystem where learners and educators connect, collaborate, and grow together.",
    },
    {
      icon: <FaAward />,
      title: "Excellence",
      description:
        "Uncompromising quality in every course, every interaction, and every learning outcome.",
    },
    {
      icon: <FaHeart />,
      title: "Accessibility",
      description:
        "Breaking down barriers to make world-class education available to everyone, everywhere.",
    },
    {
      icon: <FaGlobe />,
      title: "Global Impact",
      description:
        "Empowering millions of learners worldwide to transform their careers and lives.",
    },
    {
      icon: <FaHandshake />,
      title: "Trust",
      description:
        "Building lasting relationships through transparency, integrity, and genuine commitment to success.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Registered Learners" },
    { number: "500+", label: "Expert Instructors" },
    { number: "50K+", label: "Courses Completed" },
    { number: "4.9/5", label: "User Satisfaction" },
  ];

  const milestones = [
    {
      year: "2020",
      title: "The Beginning",
      description:
        "Learn At was founded with a vision to democratize education",
    },
    {
      year: "2022",
      title: "Rapid Growth",
      description: "Reached 5,000+ active learners and 200+ courses",
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded to serve learners in over 50 countries",
    },
    {
      year: "2025",
      title: "Innovation Leader",
      description: "Launched AI-powered personalized learning paths",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative">
        <Navbar/>
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

      <section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h1
            className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent animate-pulse"
            style={{
              animationDuration: "3s",
              animationIterationCount: "infinite",
            }}
          >
            About Learn At
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Empowering minds, transforming futures through accessible,
            world-class education.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 sm:p-12 hover:ring-white/20 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-full flex items-center justify-center text-3xl">
                <FaRocket />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                Our Story
              </h2>
            </div>
            <div className="space-y-4 text-lg text-slate-300">
              <p>
                Learn At was born from a simple yet powerful vision: education
                should be a right, not a privilege. We recognized that
                traditional learning barriers—cost, location, and
                accessibility—were preventing talented individuals from reaching
                their full potential.
              </p>
              <p>
                What started as a passionate project has evolved into a thriving
                platform serving thousands of learners worldwide. We've
                partnered with industry experts, renowned educators, and
                innovative thinkers to create courses that don't just teach—they
                transform.
              </p>
              <p>
                Today, Learn At stands as a beacon of hope for anyone seeking to
                learn, grow, and succeed. Whether you're starting a new career,
                advancing in your field, or exploring a passion, we're here to
                guide you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 hover:ring-white/20">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-full flex items-center justify-center text-2xl mb-4">
                <FaGraduationCap />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">
                Our Mission
              </h3>
              <p className="text-slate-300 text-lg">
                To democratize education by providing accessible, high-quality
                learning experiences that empower individuals to achieve their
                goals, advance their careers, and transform their lives.
              </p>
            </div>
            <div className="group bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 hover:ring-white/20">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-full flex items-center justify-center text-2xl mb-4">
                <FaRocket />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-fuchsia-400">
                Our Vision
              </h3>
              <p className="text-slate-300 text-lg">
                To become the world's most trusted learning platform where
                curiosity meets opportunity, and every learner—regardless of
                background—can unlock their full potential and shape their
                future.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-center text-4xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-3 hover:scale-105 hover:ring-white/20"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-full flex items-center justify-center text-2xl mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl mb-3 font-semibold text-cyan-300">
                  {value.title}
                </h3>
                <p className="text-slate-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl mb-12 font-bold text-center bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:ring-white/20"
              >
                <div className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-center text-4xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Our Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, i) => (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-6 hover:-translate-y-2 transition-all duration-300 hover:ring-white/20"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent mb-3">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">
                  {milestone.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Join Our Learning Community
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Be part of a global movement that's transforming education and
            empowering futures.
          </p>
          <button className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white py-4 px-10 rounded-full text-lg font-medium transition-transform hover:-translate-y-1 shadow-lg">
            Start Learning Today
          </button>
        </div>
      </section>

      <footer className="bg-slate-800 py-3 px-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Learn At. All rights reserved.
      </footer>
    </div>
  );
};

export default AboutPage;
