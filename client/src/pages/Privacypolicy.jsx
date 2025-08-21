import React, { useState } from 'react';
import Navbar from '../components/Custom/Navbar';
import { useTheme } from "../context/ThemeContext";


export default function PrivacyPolicy() {
  const { isDarkMode } = useTheme();
  return (
    <>
    <Navbar />
    <div style={{ paddingTop: '120px' }} className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className={`text-4xl font-extrabold  ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 text-center`}>Privacy Policy</h2>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">1. Introduction</h3>
        <p className="text-gray-500 leading-relaxed">
          Welcome to TravelGrid. We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <span className="font-bold">(the "Service")</span>. Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">2. Information We Collect</h3>
        <p className="text-gray-500 leading-relaxed mb-4">
          We may collect information about you in a variety of ways. The information we may collect on the Site includes:
        </p>
        <ul className="list-disc list-inside text-gray-500 ml-4 space-y-2">
          <li>
            <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.
          </li>
          <li>
            <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
          </li>
          <li>
            <strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">3. How We Use Your Information</h3>
        <p className="text-gray-500 leading-relaxed mb-4">
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
        </p>
        <ul className="list-disc list-inside text-gray-500 ml-4 space-y-2">
          <li>Create and manage your account.</li>
          <li>Process your transactions and send you related information.</li>
          <li>Enable user-to-user communications.</li>
          <li>Request feedback and contact you about your use of the Site.</li>
          <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
          <li>Resolve disputes and troubleshoot problems.</li>
          <li>Respond to product and customer service requests.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">4. Disclosure of Your Information</h3>
        <p className="text-gray-500 leading-relaxed mb-4">
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        </p>
        <ul className="list-disc list-inside text-gray-500 ml-4 space-y-2">
          <li>
            <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
          </li>
          <li>
            <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
          </li>
          <li>
            <strong>Marketing Communications:</strong> With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">5. Contact Us</h3>
        <p className="text-gray-500 leading-relaxed">
          If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@travelgrid.com" className="text-pink-500 hover:underline">privacy@travelgrid.com</a>
        </p>
      </section>
    </div>
    </>
  );
};