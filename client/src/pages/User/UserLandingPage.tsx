import image from "../../assets/e-learning-interactions-illustration-concept.png"
import { FaChalkboardTeacher, FaChartLine, FaCertificate } from "react-icons/fa"
import Navbar from "../../components/Navbar";
// import {useParams} from "react-router-dom"

const LandingPage = () => {
  const params = new URLSearchParams(window.location.search);
  console.log(params)
  return (
    <div className="font-sans bg-gray-900 text-gray-100 min-h-screen">

      <Navbar/>

  <section className="min-h-screen bg-gray-900 flex flex-col md:flex-row items-center justify-between px-8 py-20 font-serif">
  {/* Left Text Content */}
  <div className="max-w-xl">
    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 leading-tight tracking-wide">
      Empower Your Future <br />
      With{" "}
      <span className="bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text font-black italic drop-shadow-lg text-7xl">
        Learn At
      </span>
    </h1>
    <p className="mt-6 text-lg text-white leading-relaxed">
      Discover top-notch courses, track your progress, and earn certificates.
      Flexible, affordable, and powerful learning — all in one platform.
    </p>
    <div className="mt-8 flex gap-4">
      <button className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-md">
        Start Learning
      </button>
      <button className="border border-violet-400 text-violet-400 font-semibold px-6 py-3 rounded-xl hover:bg-violet-500 hover:text-white transition-all shadow-md">
        Explore Courses
      </button>
    </div>
  </div>

  {/* Right Image */}
    <div className="mt-1 md:mt-0 md:w-1/2">
        <img src={image} alt="Online Learning" className="w-[90%] h-[90%]" />
    </div>
    </section>

      {/* Features */}
      <section id="features" className="py-20 px-8 bg-gray-800">
  <h3 className="text-3xl font-bold text-center text-blue-400 mb-12">
    What We Offer
  </h3>
  <div className="grid md:grid-cols-3 gap-10">
    <div className="text-center p-8 border border-gray-700 rounded-2xl bg-gray-900 hover:shadow-lg hover:border-blue-400 transition-all">
      <div className="text-5xl text-blue-400 mb-4 flex justify-center">
        <FaChalkboardTeacher />
      </div>
      <h4 className="text-xl font-semibold text-blue-400">Expert-Led Courses</h4>
      <p className="text-gray-300 mt-3">
        Learn from top educators and industry leaders with real-world experience.
      </p>
    </div>

    <div className="text-center p-8 border border-gray-700 rounded-2xl bg-gray-900 hover:shadow-lg hover:border-blue-400 transition-all">
      <div className="text-5xl text-blue-400 mb-4 flex justify-center">
        <FaChartLine />
      </div>
      <h4 className="text-xl font-semibold text-blue-400">Progress & Reports</h4>
      <p className="text-gray-300 mt-3">
        Keep track of your goals and achievements with smart progress tracking tools.
      </p>
    </div>

    <div className="text-center p-8 border border-gray-700 rounded-2xl bg-gray-900 hover:shadow-lg hover:border-blue-400 transition-all">
      <div className="text-5xl text-blue-400 mb-4 flex justify-center">
        <FaCertificate />
      </div>
      <h4 className="text-xl font-semibold text-blue-400">Verified Certifications</h4>
      <p className="text-gray-300 mt-3">
        Earn professional certificates to boost your resume and credibility.
      </p>
    </div>
  </div>
</section>

      {/* Call to Action */}
      <section
        className="py-20 px-8 bg-gray-900 text-white text-center"
        id="contact">
        <h3 className="text-3xl font-bold mb-4">Join Thousands of Learners Today</h3>
        <p className="mb-6">Learning has never been this easy, accessible, and impactful.</p>
        <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-violet-400">
          Create Your Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-3 px-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Learn At. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
