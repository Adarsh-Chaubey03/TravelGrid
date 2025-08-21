import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const GoogleLoginButton = ({ onSuccess, onError, buttonText = "Continue with Google", className = "" }) => {
  const { googleLogin } = useAuth();

  // FIX: Context ka googleLogin use karo
  const handleSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse.credential);

      if (result.success) {
        if (onSuccess) onSuccess(); // redirect ya extra action
      } else {
        toast.error(result.error || "Google login failed");
        if (onError) onError(result.error);
      }
    } catch (error) {
      console.error("Google login error:", error);
      if (onError) onError("Failed to login with Google");
    }
  };

  const handleError = () => {
    toast.error('Google login was cancelled or failed');
    if (onError) onError('Google login was cancelled or failed');
  };

  return (
    <div className={className}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="filled_blue"
        size="large"
        text={buttonText}
        shape="rectangular"
        locale="en"
      />
    </div>
  );
};

export default GoogleLoginButton;
