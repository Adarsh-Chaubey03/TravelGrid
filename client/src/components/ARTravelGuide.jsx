import React, { useRef, useEffect, useState, useCallback } from "react";
import useARSession from "../hooks/useARSession";
import { recognizeObjects } from "../services/objectRecognitionService";
import { translateText } from "../services/translationOverlay";
import ARPointCloud from "../models/ARPointCloud";

const ARTravelGuide = ({ location, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const arContainerRef = useRef(null);
  const [error, setError] = useState("");
  const [userPosition, setUserPosition] = useState(null);
  const [arObjects, setArObjects] = useState([]);
  const [translatedOverlays, setTranslatedOverlays] = useState([]);
  const [pointCloud, setPointCloud] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gesture, setGesture] = useState(null);

  // Initialize AR session
  const { arSession, isSupported } = useARSession();

  // Load AR.js library dynamically
  useEffect(() => {
    const loadARLibraries = async () => {
      try {
        // Dynamically load AR.js
        const script = document.createElement('script');
        script.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js';
        script.async = true;
        document.head.appendChild(script);

        // Initialize point cloud mapping
        const newPointCloud = new ARPointCloud();
        setPointCloud(newPointCloud);
      } catch (err) {
        setError("Failed to load AR libraries: " + err.message);
      }
    };

    if (isSupported) {
      loadARLibraries();
    }
  }, [isSupported]);

  // Camera and geolocation access
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied. Please allow camera to use AR mode.");
      }
    };

    const initGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setUserPosition({ 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          }),
          () => setError("Location access denied. Please allow location to use AR mode."),
          { enableHighAccuracy: true }
        );
      } else {
        setError("Geolocation not supported on this device.");
      }
    };

    initCamera();
    initGeolocation();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Process video frames for object recognition
  const processFrame = useCallback(async () => {
    if (!videoRef.current || videoRef.current.readyState !== 4 || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Perform object recognition
      const objects = await recognizeObjects(videoRef.current);
      setArObjects(objects);
      
      // Generate translations for recognized objects
      const translations = await Promise.all(
        objects.map(async (obj) => {
          const translated = await translateText(obj.label, 'en', 'es'); // Default to Spanish
          return {
            ...obj,
            translatedLabel: translated
          };
        })
      );
      
      setTranslatedOverlays(translations);
      
      // Update point cloud with new spatial data
      if (pointCloud && userPosition) {
        pointCloud.update(videoRef.current, userPosition);
      }
    } catch (err) {
      console.error("Error processing frame:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, pointCloud, userPosition]);

  // Frame processing loop
  useEffect(() => {
    if (!videoRef.current) return;
    
    const processInterval = setInterval(() => {
      processFrame();
    }, 500); // Process every 500ms

    return () => clearInterval(processInterval);
  }, [processFrame]);

  // Gesture recognition
  useEffect(() => {
    const handleGesture = (e) => {
      // Simple gesture recognition based on touch movements
      if (e.type === 'touchstart') {
        setGesture('tap');
        setTimeout(() => setGesture(null), 1000);
      }
    };

    const container = arContainerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleGesture);
      return () => container.removeEventListener('touchstart', handleGesture);
    }
  }, []);

  // Render AR overlays on canvas
  const renderOverlays = useCallback(() => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw object bounding boxes and labels
    translatedOverlays.forEach(obj => {
      const { x, y, width, height, label, translatedLabel } = obj;
      
      // Draw bounding box
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(x, y - 20, ctx.measureText(label).width + 10, 20);
      
      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(label, x + 5, y - 5);
      
      // Draw translated label if available
      if (translatedLabel && translatedLabel !== label) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x, y + height, ctx.measureText(translatedLabel).width + 10, 20);
        ctx.fillStyle = '#ffff00';
        ctx.fillText(translatedLabel, x + 5, y + height + 15);
      }
    });
    
    // Draw point cloud data
    if (pointCloud) {
      pointCloud.render(ctx);
    }
    
    // Handle gesture actions
    if (gesture === 'tap') {
      // Toggle language or perform other actions
      console.log('Gesture detected: tap');
    }
  }, [translatedOverlays, pointCloud, gesture]);

  // Render overlays when data changes
  useEffect(() => {
    renderOverlays();
  }, [renderOverlays]);

  return (
    <div 
      ref={arContainerRef}
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100vw", 
        height: "100vh", 
        zIndex: 1000, 
        background: "rgba(0,0,0,0.8)" 
      }}
    >
      {/* Video feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100vw", 
          height: "100vh", 
          objectFit: "cover" 
        }} 
      />
      
      {/* Canvas for AR overlays */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none"
        }}
      />
      
      {/* Close button */}
      <button 
        onClick={onClose} 
        style={{ 
          position: "absolute", 
          top: 20, 
          right: 20, 
          zIndex: 1100, 
          background: "#fff", 
          borderRadius: 8, 
          padding: 8 
        }}
      >
        Close AR
      </button>
      
      {/* Error display */}
      {error && (
        <div 
          style={{ 
            position: "absolute", 
            top: 80, 
            left: 0, 
            right: 0, 
            color: "#fff", 
            background: "#d32f2f", 
            padding: 16, 
            zIndex: 1100, 
            textAlign: "center" 
          }}
        >
          {error}
        </div>
      )}
      
      {/* Location info and AR data */}
      {userPosition && location && (
        <div 
          style={{ 
            position: "absolute", 
            bottom: 40, 
            left: 0, 
            right: 0, 
            zIndex: 1100, 
            color: "#fff", 
            textAlign: "center" 
          }}
        >
          <h2>{location.name}</h2>
          <p>{location.overview?.description || "Explore this location in AR!"}</p>
          
          {/* AR status info */}
          <div style={{ 
            background: "rgba(0, 0, 0, 0.5)", 
            padding: 12, 
            borderRadius: 8, 
            marginTop: 8,
            display: "flex",
            justifyContent: "center",
            gap: 20
          }}>
            <span>Objects Detected: {arObjects.length}</span>
            <span>Position Accuracy: {Math.round(userPosition.accuracy)}m</span>
            {isProcessing && <span>Processing...</span>}
          </div>
        </div>
      )}
      
      {/* Gesture instructions */}
      <div 
        style={{ 
          position: "absolute", 
          top: "50%", 
          left: 0, 
          right: 0, 
          zIndex: 1100, 
          color: "#fff", 
          textAlign: "center",
          transform: "translateY(-50%)",
          pointerEvents: "none"
        }}
      >
        <p>Tap screen to interact with AR objects</p>
      </div>
    </div>
  );
};

export default ARTravelGuide;