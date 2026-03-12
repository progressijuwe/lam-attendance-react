import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import ConfirmationPage from './pages/ConfirmationPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,    element: <HomePage /> },
      { path: 'confirmed',  element: <ConfirmationPage /> },
    ],
  },
])