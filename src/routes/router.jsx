import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import OKRTrackingEngine from '../pages/module2.jsx';
import OKRUserManagement from './pages/module1.jsx';
import LoginScreen from '../pages/login.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App acts as the master wrapper holding the <Outlet />
    children: [
      {
        path: '', // This means http://localhost:5174/ (your main URL)
        element: <OKRUserManagement />,
        element: <OKRTrackingEngine/>,
      },
      /* You can easily add more pages here in the future:s
      {
        path: 'orders',
        element: <Orders />,
      } 
      */
    ],
  },
]);

export default router;