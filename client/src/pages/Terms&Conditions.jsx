import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Mail, FileText, Shield, CreditCard, Copyright, Scale, Globe } from "lucide-react";
import Navbar from "../components/Custom/Navbar";

export default function TermsAndConditions() {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState({});

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing or using the TravelGrid website (the 'Service'), you agree to be bound by these Terms and our Privacy Policy.",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Use of the Service",
      content: "TravelGrid provides an online platform for browsing and booking travel services. You agree to use the Service lawfully and without infringing others' rights.",
      list: [
        "You must be at least 18 years old",
        "Keep your account credentials secure",
        "Provide accurate and current information"
      ],
      icon: <Shield className="w-6 h-6" />,
      highlight: "blue"
    },
    {
      title: "Bookings and Payments",
      content: "When booking, you contract directly with the service provider. TravelGrid acts only as an intermediary.",
      list: [
        "Prices may change until booking is confirmed",
        "Full payment required at booking",
        "Cancellation policies vary by provider"
      ],
      icon: <CreditCard className="w-6 h-6" />,
      highlight: "orange"
    },
    {
      title: "Intellectual Property",
      content: "All website content is TravelGrid's property or licensed material, protected by copyright. Reproduction or modification without permission is prohibited.",
      icon: <Copyright className="w-6 h-6" />
    },
    {
      title: "Disclaimer of Warranties",
      content: "The Service is provided 'as is' and 'as available'. TravelGrid makes no warranties about service operation or content accuracy.",
      icon: <Scale className="w-6 h-6" />,
      highlight: "red"
    },
    {
      title: "Governing Law",
      content: "These Terms are governed by Indian law, without regard to conflict principles.",
      icon: <Globe className="w-6 h-6" />
    }
  ];

  // Highlight colors with proper contrast for both themes
  const highlightColors = {
    blue: {
      bg: isDarkMode ? "bg-blue-900/30" : "bg-blue-50",
      border: "border-blue-500",
      text: isDarkMode ? "text-blue-200" : "text-blue-800"
    },
    orange: {
      bg: isDarkMode ? "bg-amber-900/30" : "bg-amber-50",
      border: "border-amber-500",
      text: isDarkMode ? "text-amber-200" : "text-amber-800"
    },
    red: {
      bg: isDarkMode ? "bg-red-900/30" : "bg-red-50",
      border: "border-red-500",
      text: isDarkMode ? "text-red-200" : "text-red-800"
    }
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen w-full overflow-x-hidden transition-all duration-300 
        
        ${        isDarkMode 
            ? 'bg-gradient-to-br from-black to-pink-900'
            : 'from-pink-200/50 via-white/70 to-blue-200/50'}`} 
        
        
        
        
        style={{ paddingTop: "70px" }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Terms & <span className="text-pink-400">Conditions</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`text-xl sm:text-2xl mb-8 leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Please read these terms carefully before using our services.
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-1 bg-pink-400 mx-auto rounded-full"
            />
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                id={`section-${index}`}
                data-animate
                className={`transition-all duration-1000 ${isVisible[`section-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className={`p-6 sm:p-8 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isDarkMode ? "bg-pink-900/30 text-pink-300" : "bg-pink-100 text-pink-600"}`}>
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {section.title}
                      </h2>

                      <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {section.content}
                      </p>

                      {section.list && (
                        <div className={`p-4 rounded-lg border-l-4 mb-4 ${highlightColors[section.highlight].border} ${highlightColors[section.highlight].bg}`}>
                          <h4 className={`font-semibold mb-2 ${highlightColors[section.highlight].text}`}>
                            {section.highlight === "blue" ? "Requirements:" : "Important:"}
                          </h4>
                          <ul className={`space-y-1 ${highlightColors[section.highlight].text}`}>
                            {section.list.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {section.highlight === "red" && (
                        <div className={`p-4 rounded-lg border-l-4 ${highlightColors.red.border} ${highlightColors.red.bg}`}>
                          <p className={highlightColors.red.text}>
                            The Service is provided{" "}
                            <span className="font-semibold">
                              "as is"
                            </span>{" "}
                            and{" "}
                            <span className="font-semibold">
                              "as available"
                            </span>
                            . TravelGrid makes no warranties about service operation or content accuracy.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            id="contact"
            data-animate
            className={`mt-12 p-6 sm:p-8 rounded-lg text-center transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${isDarkMode ? "bg-blue-900/20 border border-blue-700" : "bg-blue-50 border border-blue-200"}`}
          >
            <h3 className={`font-semibold mb-3 text-lg ${isDarkMode ? "text-blue-100" : "text-blue-900"}`}>
              Have Questions?
            </h3>
            <p className={isDarkMode ? "text-blue-200" : "text-blue-700"}>
              Contact us if you need clarification on these terms.
            </p>
            <a
              href="mailto:legal@travelgrid.com"
              className="inline-flex items-center mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Legal Team
            </a>
          </motion.div>

          {/* Footer */}
          <motion.div
            className={`text-center mt-8 pt-6 border-t transition-all duration-300 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
              Terms effective from the date above and may be updated periodically.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}