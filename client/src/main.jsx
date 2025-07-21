import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'

// Placeholder pages (to be created if not exist)
import Discover from './pages/Discover'
import Trips from './pages/Trips'
import Review from './pages/Review'
import Forums from './pages/Forums'
import Contributors from './pages/Contributors'
import Contact from './pages/Contact'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App provides context and layout
    children: [
      { path: '/', element: <Home /> },
      { path: '/discover', element: <Discover /> },
      { path: '/trips', element: <Trips /> },
      { path: '/review', element: <Review /> },
      { path: '/forums', element: <Forums /> },
      { path: '/contributors', element: <Contributors /> },
      { path: '/contact', element: <Contact/> },

    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
) 
