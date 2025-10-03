import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const QRGenerator = ({ tripId, tripTitle }) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef();
  const { isDarkMode } = useTheme();

  const shareUrl = `${window.location.origin}/shared-trip/${tripId}`;

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `${tripTitle}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowQR(!showQR)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isDarkMode
            ? 'bg-pink-600 hover:bg-pink-700 text-white'
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
      >
        <Share2 className="w-4 h-4" />
        Share Trip
      </button>

      {showQR && (
        <div className={`absolute top-12 right-0 z-50 p-4 rounded-lg shadow-xl border ${
          isDarkMode
            ? 'bg-gray-800 border-gray-600'
            : 'bg-white border-gray-200'
        }`}>
          <div className="text-center space-y-4">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Share Your Trip
            </h3>
            
            <div ref={qrRef} className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={shareUrl}
                size={150}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={downloadQR}
                className={`flex items-center gap-1 px-3 py-2 text-sm rounded ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Download className="w-3 h-3" />
                Download
              </button>
              
              <button
                onClick={copyLink}
                className={`flex items-center gap-1 px-3 py-2 text-sm rounded ${
                  copied
                    ? 'bg-green-500 text-white'
                    : isDarkMode
                    ? 'bg-pink-600 hover:bg-pink-700 text-white'
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;