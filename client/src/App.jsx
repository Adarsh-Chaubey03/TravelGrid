import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from './components/Custom/Navbar';
import Footer from './components/Custom/Footer';
import Spinner from './components/Spinner';
import GoToTopButton from './components/GoToTopButton';
import ErrorBoundary from './components/ErrorHandle/ErrorBoundary';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {loading && <Spinner />}
      <Navbar />
      <div className="flex-grow">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
      <GoToTopButton />
      <Footer />
    </div>
  );
}

export default App;
