import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import Dashboard from '../pages/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App acts as the master wrapper holding the <Outlet />
    children: [
      {
        path: '', // This means http://localhost:5174/ (your main URL)
        element: <Dashboard />,
      },
      /* You can easily add more pages here in the future:
      {
        path: 'orders',
        element: <Orders />,
      } 
      */
    ],
  },
]);

export default router;