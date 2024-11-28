import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // import useLocation here
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import store from './store';
import './index.css';

// Lazy loaded pages
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const POS = React.lazy(() => import('./pages/POS'));
const Users = React.lazy(() => import('./pages/Users'));
const Sales = React.lazy(() => import('./pages/Sales'));
const TodaysSalesPage = React.lazy(() => import('./pages/TodaysSalesPage')); // Import TodaysSalesPage
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

// Use a separate component to use the useLocation hook
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
        <div className="flex-grow">
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
          </Routes>
        </div>
      </React.Suspense>
    </div>
  );
}

export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Navbar from './components/NavBar';
// import Footer from './components/Footer';
// import Contact from './pages/Contact';
// import store from './store';
// import './index.css';

// // Lazy loaded pages
// const Home = React.lazy(() => import('./pages/Home'));
// const Dashboard = React.lazy(() => import('./pages/Dashboard'));
// const Login = React.lazy(() => import('./pages/Login'));
// const Register = React.lazy(() => import('./pages/Register'));
// const Inventory = React.lazy(() => import('./pages/Inventory'));
// const POS = React.lazy(() => import('./pages/POS'));
// const Users = React.lazy(() => import('./pages/Users'));
// const Sales = React.lazy(() => import('./pages/Sales'));
// const TodaysSalesPage = React.lazy(() => import('./pages/TodaysSalesPage')); // Import TodaysSalesPage
// const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
// const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));

// function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <div className="min-h-screen flex flex-col bg-gray-50">
//           <Navbar />
//           <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
//           <React.Suspense
//             fallback={
//               <div className="flex items-center justify-center min-h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//               </div>
//             }
//           >
//             <div className="flex-grow">
//               <Routes>
//                 {/* Public Routes */}
//                 <Route path="/" element={<Home />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/contact" element={<Contact />} />
//                 <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot Password route */}
//                 <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Reset Password route */}

//                 {/* Main App Routes */}
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/inventory" element={<Inventory />} />
//                 <Route path="/pos" element={<POS />} />
//                 <Route path="/users" element={<Users />} />
//                 <Route path="/sales" element={<Sales />} />
//                 <Route path="/sales/today" element={<TodaysSalesPage />} /> {/* Today's Sales */}

//                 {/* Add any additional private routes here, for example:
//                   <Route path="/profile" element={<Profile />} />
//                 */}
//               </Routes>
//             </div>
//           </React.Suspense>
//           <Footer />
//         </div>
//       </Router>
//     </Provider>
//   );
// }

// export default App;


