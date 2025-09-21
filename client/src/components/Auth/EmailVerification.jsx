import React, { useState, useEffect } from 'react';
import { Mail, Shield, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import VerificationSuccess from './VerificationSuccess';

const EmailVerification = ({ 
  email, 
  onVerificationSuccess, 
  onBack, 
  showBackButton = true 
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const { verifyEmailCode, resendVerificationCode, user } = useAuth();

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return; // Only allow single character
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    setError('');
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    const input = document.getElementById(`code-input-${focusIndex}`);
    if (input) input.focus();
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyEmailCode(email, verificationCode);
      
      if (result.success) {
        setIsVerified(true);
        // Don't call onVerificationSuccess immediately, let the success component handle it
      } else {
        setError(result.error || 'Invalid verification code');
        setCode(['', '', '', '', '', '']);
        // Focus first input
        const firstInput = document.getElementById('code-input-0');
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      const result = await resendVerificationCode(email);
      
      if (result.success) {
        toast.success('Verification code resent successfully!');
        setTimeLeft(300); // Reset timer
        setCanResend(false);
        setCode(['', '', '', '', '', '']);
      } else {
        setError(result.error || 'Failed to resend verification code');
      }
    } catch (error) {
      setError('Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  // Show success screen if verified
  if (isVerified) {
    return (
      <VerificationSuccess 
        email={email}
        userName={user?.name}
        onContinue={onVerificationSuccess}
        showActions={true}
      />
    );
  }

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
        <p className="text-gray-300">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-pink-400 font-medium">{email}</p>
      </div>

      {/* Verification Form */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {/* Code Input */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-4 text-center">
            Enter Verification Code
          </label>
          <div className="flex gap-2 justify-center mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                className="w-12 h-12 text-center text-lg font-bold bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                inputMode="numeric"
                pattern="[0-9]"
              />
            ))}
          </div>
          
          {/* Timer */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'Code expired'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Verify Button */}
          <button aria-label="Search"
            onClick={handleVerify}
            disabled={isLoading || code.join('').length !== 6}
            className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Verify Email
              </>
            )}
          </button>

          {/* Resend Button */}
          <button aria-label="Search"
            onClick={handleResend}
            disabled={!canResend || isResending}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
          >
            {isResending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend Code
              </>
            )}
          </button>

          {/* Back Button */}
          {showBackButton && onBack && (
            <button aria-label="Search"
              onClick={onBack}
              className="w-full text-gray-300 hover:text-white py-2 font-medium transition-colors"
            >
              ← Back to Login
            </button>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Didn't receive the code? Check your spam folder or click resend after the timer expires.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
