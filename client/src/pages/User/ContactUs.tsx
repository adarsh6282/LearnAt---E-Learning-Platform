import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaPaperPlane,
} from "react-icons/fa";
import { CheckCircle } from "lucide-react";
import Navbar from "../../components/Navbar";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      detail: "support@learnat.com",
      link: "mailto:support@learnat.com",
    },
    {
      icon: <FaPhoneAlt />,
      title: "Call Us",
      detail: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Visit Us",
      detail: "123 Learning Street, Education City, EC 12345",
      link: "#",
    },
  ];

  const socialMedia = [
    { icon: <FaFacebook />, name: "Facebook", link: "#" },
    { icon: <FaTwitter />, name: "Twitter", link: "#" },
    { icon: <FaLinkedin />, name: "LinkedIn", link: "#" },
    { icon: <FaInstagram />, name: "Instagram", link: "#" },
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
          <h1 className="font-ornate text-5xl sm:text-6xl font-extrabold mb-6 text-white">
            Get In{" "}
            <span className="text-green-400 font-black italic drop-shadow-lg">
              Touch
            </span>
          </h1>
          <p className="font-subtext text-xl sm:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, i) => (
              <a
                key={i}
                href={info.link}
                className="group bg-white/[0.02] backdrop-blur ring-1 ring-white/10 rounded-2xl p-8 text-center hover:-translate-y-2 transition-all duration-500 hover:ring-green-500/30 cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-5 bg-green-500/10 ring-1 ring-green-500/20 text-green-400 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-green-500 group-hover:text-black transition-all duration-300 ">
                  {info.icon}
                </div>
                <h3 className="font-subtext text-xl font-bold mb-2 text-white">
                  {info.title}
                </h3>
                <p className="font-description text-neutral-400">{info.detail}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/[0.02] backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 sm:p-10">
              <h2 className="font-subtext text-3xl font-bold mb-8 text-white">
                Send Us a{" "}
                <span className="font-subtext text-green-400 font-black italic">
                  Message
                </span>
              </h2>

              {submitted && (
                <div className="mb-6 bg-green-500/10 ring-1 ring-green-500/20 text-green-400 text-sm text-center font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3 placeholder-neutral-500 focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3 placeholder-neutral-500 focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3 placeholder-neutral-500 focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3 placeholder-neutral-500 focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="group/btn relative w-full inline-flex items-center justify-center gap-2 py-3 px-8 text-base font-semibold rounded-full overflow-hidden transition-all duration-300 ring-1 bg-green-500 text-black hover:ring-green-500/30 hover:-translate-y-0.5 shadow-lg shadow-green-500/20"
                >
                  <span className="absolute inset-0 bg-black transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></span>
                  <span className="font-subtext relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover/btn:text-green-500">
                    <FaPaperPlane />
                    Send Message
                  </span>
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white/[0.02] backdrop-blur ring-1 ring-white/10 rounded-3xl p-8">
                <h3 className="font-subtext text-2xl font-bold mb-6 text-white">
                  Why Contact Us?
                </h3>
                <ul className="font-description space-y-4 text-neutral-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">
                      <CheckCircle size={16} />
                    </span>
                    <span>Get help with course enrollment and platform navigation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">
                      <CheckCircle size={16} />
                    </span>
                    <span>Technical support for any issues you're experiencing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">
                      <CheckCircle size={16} />
                    </span>
                    <span>Partnership and collaboration inquiries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">
                      <CheckCircle size={16} />
                    </span>
                    <span>Feedback and suggestions to improve LearnAt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">
                      <CheckCircle size={16} />
                    </span>
                    <span>General questions about our courses and certificates</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/[0.02] backdrop-blur ring-1 ring-white/10 rounded-3xl p-8">
                <h3 className="font-subtext text-2xl font-bold mb-6 text-white">Office Hours</h3>
                <div className="font-description space-y-3 text-neutral-300">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Saturday:</span>
                    <span className="font-semibold text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-semibold text-white">Closed</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 mt-4">
                  * All times are in EST. We typically respond within 24 hours.
                </p>
              </div>

              <div className="bg-white/[0.02] backdrop-blur ring-1 ring-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  {socialMedia.map((social, i) => (
                    <a
                      key={i}
                      href={social.link}
                      className="w-12 h-12 bg-white/5 ring-1 ring-white/10 rounded-xl flex items-center justify-center text-lg text-neutral-300 hover:bg-green-500 hover:text-black hover:ring-transparent transition-all duration-300 hover:-translate-y-1"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="font-ornate text-center text-4xl font-bold mb-12 text-white">
            Frequently Asked{" "}
            <span className="font-ornate text-green-400 font-black italic">Questions</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "How quickly will I receive a response?",
                a: "We typically respond to all inquiries within 24 hours during business days.",
              },
              {
                q: "Can I schedule a call with support?",
                a: "Yes! Contact us and we'll arrange a convenient time for a call.",
              },
              {
                q: "Do you offer phone support?",
                a: "Yes, phone support is available during office hours for urgent matters.",
              },
              {
                q: "How can I report a technical issue?",
                a: "Use the contact form above or email us directly at support@learnat.com with details.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="font-subtext bg-white/[0.02] backdrop-blur ring-1 ring-white/10 rounded-2xl p-6 hover:ring-green-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                <h4 className="text-lg font-bold mb-2 text-green-400">{faq.q}</h4>
                <p className="text-neutral-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-white/10 py-8 px-4 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} LearnAt. Empowering minds globally. All rights reserved.
      </footer>
    </div>
  );
};

export default ContactPage;