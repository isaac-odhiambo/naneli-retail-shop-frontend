import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import Navbar from './components/NavBar';
import Footer from './components/Footer'; // Import the Footer component
import Contact from './pages/Contact';
import store from './store'; // Your Redux store
import './index.css';
import { useSelector } from 'react-redux';

// Lazy-loaded pages
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const POS = React.lazy(() => import('./pages/POS'));
const Users = React.lazy(() => import('./pages/Users'));
const Sales = React.lazy(() => import('./pages/Sales'));
const TodaysSalesPage = React.lazy(() => import('./pages/TodaysSalesPage'));
const Profit = React.lazy(() => import('./pages/Profit'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));

// ProtectRoute component to handle admin-only access
function ProtectRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />; // Redirect to dashboard if user is not admin
  }

  return children;
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

function AppContent() {
  const location = useLocation();

  // List of paths where you don't want to render the Navbar (e.g. login, register)
  const noNavbarPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Conditionally render Navbar based on route */}
      {!noNavbarPaths.includes(location.pathname) && <Navbar />}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

      <React.Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        }
      >
        <div className="flex-grow"> {/* Ensure content area takes available space */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Main Routes (Authenticated) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/users" element={<Users />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/today" element={<TodaysSalesPage />} />

            {/* Admin-only Routes */}
            <Route path="/profit" element={
              <ProtectRoute>
                <Profit />
              </ProtectRoute>
            } />
          </Routes>
        </div>
      </React.Suspense>

      {/* Always show Footer */}
      <Footer />
    </div>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Navbar from './components/NavBar';
// import Footer from './components/Footer'; // Import the Footer component
// import Contact from './pages/Contact';
// import store from './store'; // Your Redux store
// import './index.css';
// import { useSelector } from 'react-redux';

// // Lazy-loaded pages
// const Home = React.lazy(() => import('./pages/Home'));
// const Dashboard = React.lazy(() => import('./pages/Dashboard'));
// const Login = React.lazy(() => import('./pages/Login'));
// const Register = React.lazy(() => import('./pages/Register'));
// const Inventory = React.lazy(() => import('./pages/Inventory'));
// const POS = React.lazy(() => import('./pages/POS'));
// const Users = React.lazy(() => import('./pages/Users'));
// const Sales = React.lazy(() => import('./pages/Sales'));
// const TodaysSalesPage = React.lazy(() => import('./pages/TodaysSalesPage'));
// const Profit = React.lazy(() => import('./pages/Profit'));
// const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
// const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));

// // ProtectRoute component to handle admin-only access
// function ProtectRoute({ children }) {
//   const user = useSelector((state) => state.auth.user);

//   if (!user || user.role !== 'admin') {
//     return <Navigate to="/dashboard" />; // Redirect to dashboard if user is not admin
//   }

//   return children;
// }

// function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <AppContent />
//       </Router>
//     </Provider>
//   );
// }

// function AppContent() {
//   const location = useLocation();

//   // List of paths where you don't want to render the Navbar (e.g. login, register)
//   const noNavbarPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Conditionally render Navbar based on route */}
//       {!noNavbarPaths.includes(location.pathname) && <Navbar />}

//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      
//       <React.Suspense
//         fallback={
//           <div className="flex items-center justify-center min-h-screen">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//           </div>
//         }
//       >
//         <div className="flex-grow">
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password/:token" element={<ResetPassword />} />

//             {/* Main Routes (Authenticated) */}
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/inventory" element={<Inventory />} />
//             <Route path="/pos" element={<POS />} />
//             <Route path="/users" element={<Users />} />
//             <Route path="/sales" element={<Sales />} />
//             <Route path="/sales/today" element={<TodaysSalesPage />} />

//             {/* Admin-only Routes */}
//             <Route path="/profit" element={
//               <ProtectRoute>
//                 <Profit />
//               </ProtectRoute>
//             } />
//           </Routes>
//         </div>
//       </React.Suspense>

//       {/* Always show Footer */}
//       <Footer />
//     </div>
//   );
// }

// export default App;
