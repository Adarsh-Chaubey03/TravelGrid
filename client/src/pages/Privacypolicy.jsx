import React, { useState } from 'react';
import Navbar from '../components/Custom/Navbar';
import { useTheme } from "../context/ThemeContext";

export default function PrivacyPolicy() {
  const { isDarkMode } = useTheme();
  return (
    <>
      <Navbar />
      <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8
        
        
        ${        isDarkMode 
            ? 'bg-gradient-to-br from-black to-pink-900'
            : 'from-pink-200/50 via-white/70 to-blue-200/50'}`}
        
        
        
        
        style={{ paddingTop: '140px' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-xl border p-8 md:p-12`}>

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className={`text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Privacy Policy
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full"></div>
              <p className={`mt-6 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-10">

              {/* Introduction */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    1
                  </div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Introduction
                  </h2>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-6`}>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg`}>
                    Welcome to TravelGrid. We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <span className="font-semibold text-pink-500">(the "Service")</span>. Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                  </p>
                </div>
              </section>

              {/* Information We Collect */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    2
                  </div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Information We Collect
                  </h2>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-6`}>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg mb-6`}>
                    We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Personal Data",
                        content: "Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards."
                      },
                      {
                        title: "Derivative Data",
                        content: "Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site."
                      },
                      {
                        title: "Financial Data",
                        content: "Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site."
                      }
                    ].map((item, index) => (
                      <div key={index} className={`${isDarkMode ? 'bg-gray-600/30' : 'bg-white'} rounded-lg p-4 border-l-4 border-pink-500`}>
                        <h4 className={`font-semibold ${isDarkMode ? 'text-pink-400' : 'text-pink-600'} mb-2 text-lg`}>
                          {item.title}
                        </h4>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    3
                  </div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    How We Use Your Information
                  </h2>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-6`}>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg mb-6`}>
                    Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Create and manage your account",
                      "Process your transactions and send you related information",
                      "Enable user-to-user communications",
                      "Request feedback and contact you about your use of the Site",
                      "Deliver targeted advertising, coupons, newsletters, and other information regarding promotions",
                      "Resolve disputes and troubleshoot problems",
                      "Respond to product and customer service requests"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Disclosure of Your Information */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    4
                  </div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Disclosure of Your Information
                  </h2>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-6`}>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg mb-6`}>
                    We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        title: "By Law or to Protect Rights",
                        content: "If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation."
                      },
                      {
                        title: "Third-Party Service Providers",
                        content: "We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance."
                      },
                      {
                        title: "Marketing Communications",
                        content: "With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law."
                      }
                    ].map((item, index) => (
                      <div key={index} className={`${isDarkMode ? 'bg-gray-600/30' : 'bg-white'} rounded-lg p-4 border-l-4 border-purple-500`}>
                        <h4 className={`font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mb-2 text-lg`}>
                          {item.title}
                        </h4>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Contact Us */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    5
                  </div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Contact Us
                  </h2>
                </div>
                <div className={`${isDarkMode ? 'bg-gradient-to-r from-pink-500/10 to-purple-600/10 border-pink-500/20' : 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200'} rounded-lg p-6 border-2`}>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg`}>
                    If you have questions or comments about this Privacy Policy, please contact us at:{' '}
                    <a
                      href="mailto:privacy@travelgrid.com"
                      className="font-semibold text-pink-500 hover:text-purple-600 transition-colors duration-200 underline decoration-2 underline-offset-2"
                    >
                      support@travelgrid.com                    </a>
                  </p>
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};