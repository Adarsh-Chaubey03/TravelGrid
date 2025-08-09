import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmailVerification from '../components/Auth/EmailVerification';
import Navbar from '../components/Custom/Navbar';
import Footer from '../components/Custom/Footer';
import { toast } from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Get email from URL params or user context
    const emailParam = searchParams.get('email');
    const userEmail = user?.email;
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (userEmail) {
      setEmail(userEmail);
    } else {
      // No email available, redirect to signup
      toast.error('Email verification session expired');
      navigate('/signup');
    }
  }, [searchParams, user, navigate]);

  const handleVerificationSuccess = () => {
    toast.success('Email verified successfully! Welcome to TravelGrid! 🎉');
    navigate('/', { replace: true });
  };

  const handleBack = () => {
    navigate('/login');
  };

  if (!email) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 min-h-screen bg-gradient-to-br from-black to-pink-900 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading verification page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gradient-to-br from-black to-pink-900 flex items-center justify-center p-4">
        <EmailVerification 
          email={email}
          onVerificationSuccess={handleVerificationSuccess}
          onBack={handleBack}
          showBackButton={true}
        />
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
