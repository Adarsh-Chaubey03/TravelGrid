import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", 
    });
  }, [location.pathname]); 

  return children;
};

export default AuthLayout;
