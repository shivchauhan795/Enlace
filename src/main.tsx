import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ProtectedRoutes from '../ProtectedRoutes.tsx'
import PublicRoutes from '../PublicRoutes.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'
import Admin from './components/Admin.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/admin',
        element: <><Admin /></>
      }
    ]
  },
  {
    element: <PublicRoutes />,
    children: [
      {
        path: '/login',
        element: <><Login /></>
      },
      {
        path: '/register',
        element: <><Register /></>
      }
    ]
  },

])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
