import React, { useState } from 'react';
import Navbar from '../components/Custom/Navbar';


export default function TermsAndConditions() {
  return (
    <>
    <Navbar />
    <div className="bg-white p-8 rounded-lg shadow-lg" style={{ paddingTop: '70px' }}>
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Terms & Conditions</h2>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">1. Acceptance of Terms</h3>
        <p className="text-gray-500 leading-relaxed">
          By accessing or using the TravelGrid website <span className="font-bold">(the "Service")</span>, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">2. Use of the Service</h3>
        <p className="text-gray-500 leading-relaxed mb-4">
          TravelGrid provides an online platform that allows users to browse, compare, and book travel-related services such as flights, hotels, packages, and activities. You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service.
        </p>
        <ul className="list-disc list-inside text-gray-500 ml-4 space-y-2">
          <li>You must be at least 18 years old to use this Service.</li>
          <li>You are responsible for maintaining the confidentiality of your account and password.</li>
          <li>All information you provide must be accurate, complete, and current.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">3. Bookings and Payments</h3>
        <p className="text-gray-500 leading-relaxed mb-4">
          When you make a booking through TravelGrid, you are entering into a contract directly with the travel service provider (e.g., airline, hotel). TravelGrid acts solely as an intermediary.
        </p>
        <ul className="list-disc list-inside text-gray-500 ml-4 space-y-2">
          <li>Prices are subject to change without notice until a booking is confirmed.</li>
          <li>Payment must be made in full at the time of booking unless otherwise specified.</li>
          <li>Cancellation and refund policies are determined by the individual service providers and will be clearly stated at the time of booking.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">4. Intellectual Property</h3>
        <p className="text-gray-500 leading-relaxed">
          All content on the TravelGrid website, including text, graphics, logos, images, and software, is the property of TravelGrid or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">5. Disclaimer of Warranties</h3>
        <p className="text-gray-500 leading-relaxed">
          The Service is provided on an "as is" and "as available" basis. TravelGrid makes no representations or warranties of any kind, express or implied, as to the operation of the Service or the information, content, materials, or products included on the Service.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">6. Governing Law</h3>
        <p className="text-gray-500 leading-relaxed">
          These Terms and Conditions are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
        </p>
      </section>
    </div>
    </>
  );
};