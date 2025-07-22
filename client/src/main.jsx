import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'

//Created guides page to display travel guides
import TravelGuidesCarousel from './pages/TravelGuidesProfiles.jsx'
import Contact from './components/Contact';

import Discover from './pages/Discover'
import Trips from './pages/Trips'
import Review from './pages/Review'
import Forums from './pages/Forums'
import Contributors from './pages/Contributors'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/discover', element: <Discover /> },
      { path: '/trips', element: <Trips /> },
      { path: '/review', element: <Review /> },
      { path: '/forums', element: <Forums /> },
      { path: '/contributors', element: <Contributors /> },


      { path: '/contact', element: <Contact /> },

    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
