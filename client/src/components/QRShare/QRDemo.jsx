import React from 'react';
import QRGenerator from './QRGenerator';
import { useTheme } from '../../context/ThemeContext';

const QRDemo = () => {
  const { isDarkMode } = useTheme();
  
  // Mock trip data for demo
  const mockTrip = {
    _id: '507f1f77bcf86cd799439011',
    destination: 'Paris',
    country: 'France'
  };

  return (
    <div className={`p-6 rounded-lg ${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    }`}>
      <h3 className="text-xl font-bold mb-4">QR Code Trip Sharing Demo</h3>
      <p className="mb-4">Click the button below to generate a QR code for sharing a trip:</p>
      
      <div className="flex items-center gap-4">
        <div>
          <h4 className="font-semibold">{mockTrip.destination}, {mockTrip.country}</h4>
          <p className="text-sm text-gray-500">Sample trip for demonstration</p>
        </div>
        <QRGenerator 
          tripId={mockTrip._id} 
          tripTitle={`${mockTrip.destination}, ${mockTrip.country}`}
        />
      </div>
    </div>
  );
};

export default QRDemo;