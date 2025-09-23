import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({ onSuccess, buttonText, className }) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={() => console.log("Google Login Failed")}
      clientId="200124904066-qoobaps3o4n4fcmj5l48bulorgo7lvaq.apps.googleusercontent.com"
      useOneTap
      theme="outline"
      render={({ onClick }) => (
        <button
          type="button"
          onClick={onClick}
          className={className + " flex justify-center items-center gap-2 bg-white text-gray-700 border rounded-lg py-3 px-6 hover:bg-gray-100"}
        >
          {buttonText}
        </button>
      )}
    />
  );
};

export default GoogleLoginButton;
