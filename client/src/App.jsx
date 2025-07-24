import React,{ useState, useEffect } from 'react'
import { Outlet,useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import Navbar from './components/Custom/Navbar'
import Footer from './components/Custom/Footer'
import ScrollToTop from './components/Custom/ScrollToTop'
import FloatingActionButton from './components/Custom/FloatingActionButton'
import PageTransition from './components/Custom/PageTransition'
import ProgressBar from './components/Custom/ProgressBar'
import TravelTips from './components/Custom/TravelTips'

import Spinner from './components/Spinner'

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
<NotificationProvider>
<AuthProvider>
    <AppProvider>
      <div className="flex flex-col min-h-screen">
        <ProgressBar />
        {loading && <Spinner />}
        <Navbar />
        <div className="flex-grow">
          <ErrorBoundary>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </ErrorBoundary>
          </div>
          <Footer />
          <ScrollToTop />
          <FloatingActionButton />
          <TravelTips />
        </div>
      </AppProvider>
    </AuthProvider>
    </NotificationProvider>
  )
}

export default App