import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import Navbar from '../../components/Navbar';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      detail: "support@learnat.com",
      link: "mailto:support@learnat.com"
    },
    {
      icon: <FaPhone />,
      title: "Call Us",
      detail: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Visit Us",
      detail: "123 Learning Street, Education City, EC 12345",
      link: "#"
    }
  ];

  const socialMedia = [
    { icon: <FaFacebook />, name: "Facebook", link: "#" },
    { icon: <FaTwitter />, name: "Twitter", link: "#" },
    { icon: <FaLinkedin />, name: "LinkedIn", link: "#" },
    { icon: <FaInstagram />, name: "Instagram", link: "#" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative">
        <Navbar/>
      <div className="fixed top-[10%] left-[10%] w-2.5 h-2.5 bg-cyan-400/30 rounded-full animate-pulse" />
      <div className="fixed top-[20%] right-[20%] w-4 h-4 bg-fuchsia-400/30 rounded-full animate-bounce" style={{ animationDelay: "2s" }} />
      <div className="fixed bottom-[30%] left-[30%] w-2 h-2 bg-cyan-400/30 rounded-full animate-ping" style={{ animationDelay: "4s" }} />
      <div className="fixed bottom-[20%] right-[10%] w-3 h-3 bg-fuchsia-400/30 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />

      <section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent animate-pulse" style={{ animationDuration: "3s", animationIterationCount: "infinite" }}>
            Get In Touch
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
                className="group bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:ring-white/20 cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">{info.title}</h3>
                <p className="text-slate-400">{info.detail}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8 sm:p-10">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                Send Us a Message
              </h2>
              
              {submitted && (
                <div className="mb-6 bg-green-500/20 ring-1 ring-green-500/50 rounded-2xl p-4 text-green-300">
                  ✓ Thank you! Your message has been sent successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 ring-1 ring-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 ring-1 ring-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 ring-1 ring-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-white/5 ring-1 ring-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white py-4 px-8 rounded-full text-lg font-medium transition-transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
                >
                  <FaPaperPlane />
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-cyan-400">Why Contact Us?</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Get help with course enrollment and platform navigation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Technical support for any issues you're experiencing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Partnership and collaboration inquiries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Feedback and suggestions to improve Learn At</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>General questions about our courses and certificates</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-fuchsia-400">Office Hours</h3>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-4">
                  * All times are in EST. We typically respond within 24 hours.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  {socialMedia.map((social, i) => (
                    <a
                      key={i}
                      href={social.link}
                      className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform duration-300"
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
          <h2 className="text-center text-4xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "How quickly will I receive a response?",
                a: "We typically respond to all inquiries within 24 hours during business days."
              },
              {
                q: "Can I schedule a call with support?",
                a: "Yes! Contact us and we'll arrange a convenient time for a call."
              },
              {
                q: "Do you offer phone support?",
                a: "Yes, phone support is available during office hours for urgent matters."
              },
              {
                q: "How can I report a technical issue?",
                a: "Use the contact form above or email us directly at support@learnat.com with details."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl p-6 hover:ring-white/20 transition-all duration-300">
                <h4 className="text-lg font-semibold mb-2 text-cyan-300">{faq.q}</h4>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-800 py-3 px-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Learn At. All rights reserved.
      </footer>
    </div>
  );
};

export default ContactPage;