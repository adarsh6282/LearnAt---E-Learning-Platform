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
import { LuTelescope } from "react-icons/lu";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

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

      <section className="pt-32 pb-20 relative">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h1
            className="font-ornate text-5xl sm:text-6xl font-extrabold mb-6 text-white"
          >
            About{" "}
            <span className="text-green-400 font-black italic drop-shadow-lg">
              Learn At
            </span>
          </h1>
          <p className="font-subtext text-xl sm:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Empowering minds, transforming futures through accessible,
            world-class education.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 sm:p-12 transition-all duration-500 hover:ring-green-500/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-green-500 text-black rounded-full flex items-center justify-center text-3xl">
                <FaRocket />
              </div>
              <h2
                className=" font-ornate text-3xl sm:text-4xl font-bold text-white"
              >
                Our{" "}
                <span className="text-green-400 font-black italic">
                  Story
                </span>
              </h2>
            </div>
            <div className="font-description space-y-4 text-lg text-neutral-300">
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
            <div className="group bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 hover:ring-green-500/20">
              <div className="w-14 h-14 bg-green-500 text-black rounded-full flex items-center justify-center text-2xl mb-6">
                <FaGraduationCap />
              </div>
              <h3
                className="font-ornate text-2xl font-bold mb-4 text-green-400"
              >
                Our Mission
              </h3>
              <p className="font-description text-neutral-400 text-lg">
                To democratize education by providing accessible, high-quality
                learning experiences that empower individuals to achieve their
                goals, advance their careers, and transform their lives.
              </p>
            </div>
            <div className="group bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 hover:ring-green-500/20">
              <div className="w-14 h-14 bg-green-500 text-black rounded-full flex items-center justify-center text-2xl mb-6">
                <LuTelescope />
              </div>
              <h3
                className="font-ornate text-2xl font-bold mb-4 text-green-400"
              >
                Our Vision
              </h3>
              <p className="font-description text-neutral-400 text-lg">
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
          <h2
            className="font-ornate text-center text-4xl font-bold mb-12 text-white"
          >
            Our Core{" "}
            <span className="text-green-400 font-black italic">Values</span>
          </h2>
          <div className="font-description grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-3 hover:scale-105 hover:ring-green-500/20"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="w-14 h-14 bg-green-500 text-black rounded-full flex items-center justify-center text-2xl mb-4">
                  {value.icon}
                </div>
                <h3
                  className="font-ornate text-xl mb-3 font-semibold text-white"
                >
                  {value.title}
                </h3>
                <p className="text-neutral-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2
            className="font-ornate text-4xl mb-12 font-bold text-center text-white"
          >
            Our{" "}
            <span className="text-green-400 font-black italic">Impact</span>
          </h2>
          <div className="font-description grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 text-center hover:-translate-y-2 transition-all duration-500 hover:ring-green-500/20"
              >
                <div className="text-5xl font-extrabold text-green-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2
            className="font-ornate text-center text-4xl font-bold mb-12 text-white"
          >
            Our{" "}
            <span className="text-green-400 font-black italic">Journey</span>
          </h2>
          <div className="font-description grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, i) => (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-6 hover:-translate-y-2 transition-all duration-500 hover:ring-green-500/20"
              >
                <div className="text-3xl font-bold text-green-400 mb-3">
                  {milestone.year}
                </div>
                <h3
                  className="font-ornate text-xl font-semibold mb-2 text-white"
                >
                  {milestone.title}
                </h3>
                <p className="text-neutral-400 text-sm">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-5">
          <h2
            className="font-ornate text-3xl sm:text-4xl font-bold mb-6 text-white"
          >
            Join Our{" "}
            <span className="text-green-400 font-black italic">
              Learning Community
            </span>
          </h2>
          <p className="text-xl text-neutral-400 mb-10">
            Be part of a global movement that's transforming education and
            empowering futures.
          </p>

          <button
            onClick={() => navigate("/users/courses")}
            className="group/btn relative inline-flex items-center justify-center py-4 px-10 text-lg font-semibold rounded-full overflow-hidden bg-green-500 text-black transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
          >
            <span className="absolute inset-0 bg-black transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></span>
            <span className="font-ornate relative z-10 transition-colors duration-500 group-hover/btn:text-green-500">
              Start Learning Today
            </span>
          </button>
        </div>
      </section>

      <footer className="bg-black border-t border-white/10 py-3 px-4 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} Learn At. All rights reserved.
      </footer>
    </div>
  );
};

export default AboutPage;