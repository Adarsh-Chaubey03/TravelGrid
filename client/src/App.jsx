import React from 'react'
import { AppProvider } from './context/AppContext'
import { Outlet } from 'react-router-dom'
import ErrorBoundary from './components/ErrorHandle/ErrorBoundary'
import Navbar from './components/Custom/Navbar'
import Footer from './components/Custom/Footer'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
    <AppProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    </AppProvider>
    </ThemeProvider>
  )
}

export default App