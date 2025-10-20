import { useState, useEffect } from 'react';

/**
 * Custom hook for managing AR session lifecycle and sensor input
 * Handles camera access, geolocation, device orientation, and AR framework initialization
 */
const useARSession = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [arSession, setArSession] = useState(null);
  const [deviceOrientation, setDeviceOrientation] = useState(null);
  const [acceleration, setAcceleration] = useState(null);
  const [error, setError] = useState(null);

  // Check AR support
  useEffect(() => {
    const checkARSupport = () => {
      // Check for WebXR support
      const webXRSupported = navigator.xr && typeof navigator.xr.isSessionSupported === 'function';
      
      // Check for WebGL support
      const canvas = document.createElement('canvas');
      const webGLSupported = !!(
        window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      
      // Check for required APIs
      const mediaDevicesSupported = !!navigator.mediaDevices;
      const geolocationSupported = !!navigator.geolocation;
      
      // For AR.js, we need WebGL and media devices
      const supported = webGLSupported && mediaDevicesSupported && geolocationSupported;
      
      setIsSupported(supported);
      
      if (!supported) {
        setError('AR is not supported on this device. Required features: WebGL, Camera, Geolocation.');
      }
      
      return supported;
    };
    
    checkARSupport();
  }, []);

  // Device orientation tracking
  useEffect(() => {
    const handleOrientation = (event) => {
      setDeviceOrientation({
        alpha: event.alpha,   // Rotation around z-axis
        beta: event.beta,     // Rotation around x-axis
        gamma: event.gamma     // Rotation around y-axis
      });
    };

    // Request permission for device orientation on iOS
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // Non-iOS devices
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Device motion tracking
  useEffect(() => {
    const handleMotion = (event) => {
      setAcceleration({
        x: event.acceleration?.x || 0,
        y: event.acceleration?.y || 0,
        z: event.acceleration?.z || 0,
        interval: event.interval
      });
    };

    // Request permission for device motion on iOS
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        })
        .catch(console.error);
    } else {
      // Non-iOS devices
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  // Initialize AR session
  const initARSession = async () => {
    if (!isSupported) {
      throw new Error('AR is not supported on this device');
    }

    try {
      // For AR.js, we don't need to explicitly create a session
      // The library handles this internally
      const session = {
        isActive: true,
        timestamp: Date.now(),
        deviceOrientation,
        acceleration
      };
      
      setArSession(session);
      return session;
    } catch (err) {
      setError(`Failed to initialize AR session: ${err.message}`);
      throw err;
    }
  };

  // Clean up AR session
  const endARSession = () => {
    if (arSession) {
      // Clean up any AR-specific resources
      setArSession(null);
    }
  };

  return {
    isSupported,
    arSession,
    deviceOrientation,
    acceleration,
    error,
    initARSession,
    endARSession
  };
};

export default useARSession;