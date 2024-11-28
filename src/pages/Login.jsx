import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Important for sending cookies with the request
      });

      const data = await response.json();

      if (response.ok) {
        // Dispatch user details to Redux store, no token required anymore
        dispatch(
          login({
            user: {
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
              role: data.user.role, // Capture role from API response
            },
          })
        );

        // Redirect all users to the dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || 'Invalid login credentials.');
      }
    } catch (err) {
      setError('An error occurred while logging in. Please try again.');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome Back! Please Log In
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register here
          </a>
        </p>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md"
              >
                Login
              </button>
            </div>
          </form>

          {/* Back to Home Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToHome}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { login } from '../store/slices/authSlice'; // Adjust the import path as needed
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//         credentials: 'include', // Important for sending cookies with the request
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Dispatch user details to Redux store, no token required anymore
//         dispatch(
//           login({
//             user: {
//               id: data.user.id,
//               username: data.user.username,
//               email: data.user.email,
//               role: data.user.role, // Capture role from API response
//             },
//           })
//         );

//         // Redirect based on role
//         if (data.user.role === 'admin') {
//           navigate('/dashboard'); //  Dashboard
//         } else if (data.user.role === 'cashier') {
//           navigate('/pos'); // Cashier POS
//         } else if (data.user.role === 'manager') {
//           navigate('/manager-dashboard'); // Manager Dashboard
//         }
//       } else {
//         setError(data.error || 'Invalid login credentials.');
//       }
//     } catch (err) {
//       setError('An error occurred while logging in. Please try again.');
//     }
//   };

//   const handleBackToHome = () => {
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-bold text-gray-900">
//           Welcome Back! Please Log In
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//             Register here
//           </a>
//         </p>
//         {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleLogin}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md"
//               >
//                 Login
//               </button>
//             </div>
//           </form>

//           {/* Back to Home Button */}
//           <div className="mt-6 text-center">
//             <button
//               onClick={handleBackToHome}
//               className="text-indigo-600 hover:text-indigo-500 font-medium"
//             >
//               Back to Home
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { login } from '../store/slices/authSlice'; // Adjust the import path as needed
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//         credentials: 'include', // Important for sending cookies with the request
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Dispatch user details to Redux store, no token required anymore
//         dispatch(
//           login({
//             user: {
//               id: data.user.id,
//               username: data.user.username,
//               email: data.user.email,
//               role: data.user.role, // Capture role from API response
//             },
//           })
//         );

//         // Redirect based on role
//         if (data.user.role === 'admin') {
//           navigate('/admin-dashboard'); // Admin Dashboard
//         } else if (data.user.role === 'cashier') {
//           navigate('/pos'); // Cashier POS
//         } else if (data.user.role === 'manager') {
//           navigate('/manager-dashboard'); // Manager Dashboard
//         }
//       } else {
//         setError(data.error || 'Invalid login credentials.');
//       }
//     } catch (err) {
//       setError('An error occurred while logging in. Please try again.');
//     }
//   };

//   const handleBackToHome = () => {
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-bold text-gray-900">
//           Welcome Back! Please Log In
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//             Register here
//           </a>
//         </p>
//         {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleLogin}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md"
//               >
//                 Login
//               </button>
//             </div>
//           </form>

//           {/* Back to Home Button */}
//           <div className="mt-6 text-center">
//             <button
//               onClick={handleBackToHome}
//               className="text-indigo-600 hover:text-indigo-500 font-medium"
//             >
//               Back to Home
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { login } from '../store/slices/authSlice'; // Adjust the import path as needed
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Dispatch user details and token to Redux store
//         dispatch(
//           login({
//             user: {
//               id: data.user.id,
//               username: data.user.username,
//               email: data.user.email,
//               role: data.user.role, // Capture role from API response
//             },
//             token: data.access_token,
//           })
//         );

//         // Redirect based on role
//         if (data.user.role === 'admin') {
//           navigate('/dashboard'); // Admin Dashboard
//         } else if (data.user.role === 'cashier') {
//           navigate('/pos'); // Cashier POS
//         } else if (data.user.role === 'manager') {
//           navigate('/inventory'); // Manager Inventory
//         }
//       } else {
//         setError(data.error || 'Invalid login credentials.');
//       }
//     } catch (err) {
//       setError('An error occurred while logging in. Please try again.');
//     }
//   };

//   const handleBackToHome = () => {
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-bold text-gray-900">
//           Welcome Back! Please Log In
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//             Register here
//           </a>
//         </p>
//         {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleLogin}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md"
//               >
//                 Login
//               </button>
//             </div>
//           </form>

//           {/* Back to Home Button */}
//           <div className="mt-6 text-center">
//             <button
//               onClick={handleBackToHome}
//               className="text-indigo-600 hover:text-indigo-500 font-medium"
//             >
//               Back to Home
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { login } from '../store/slices/authSlice'; // Adjust path as needed
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Dispatch user details and token to Redux store
//         dispatch(
//           login({
//             user: {
//               id: data.user.id,
//               username: data.user.username,
//               email: data.user.email,
//               role: data.user.role, // Capture role from API response
//             },
//             token: data.access_token,
//           })
//         );

//         // Redirect based on role
//         if (data.user.role === 'admin') {
//           navigate('/dashboard'); // Admin Dashboard
//         } else if (data.user.role === 'cashier') {
//           navigate('/pos'); // Cashier POS
//         } else if (data.user.role === 'manager') {
//           navigate('/inventory'); // Manager Inventory
//         }
//       } else {
//         setError(data.error || 'Invalid login credentials.');
//       }
//     } catch (err) {
//       setError('An error occurred while logging in. Please try again.');
//     }
//   };

//   const handleBackToHome = () => {
//     // Navigate back to home page
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-bold text-gray-900">
//           Welcome Back! Please Log In
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <a
//             href="/register"
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Register here
//           </a>
//         </p>
//         {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleLogin}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md"
//               >
//                 Login
//               </button>
//             </div>
//           </form>

//           {/* Back to Home Button */}
//           <div className="mt-6 text-center">
//             <button
//               onClick={handleBackToHome}
//               className="text-indigo-600 hover:text-indigo-500 font-medium"
//             >
//               Back to Home
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { login } from '../store/slices/authSlice'; // Adjust path as needed
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Dispatch user details and token to Redux store
//         dispatch(
//           login({
//             user: {
//               id: data.user.id,
//               username: data.user.username,
//               email: data.user.email,
//               role: data.user.role, // Capture role from API response
//             },
//             token: data.access_token,
//           })
//         );

//         // Redirect based on role
//         if (data.user.role === 'admin') {
//           navigate('/dashboard'); // Admin Dashboard
//         } else if (data.user.role === 'cashier') {
//           navigate('/pos'); // Cashier POS
//         } else if (data.user.role === 'manager') {
//           navigate('/inventory'); // Manager Inventory
//         }
//       } else {
//         setError(data.error || 'Invalid login credentials.');
//       }
//     } catch (err) {
//       setError('An error occurred while logging in. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-bold text-gray-900">
//           Login to Your Account
//         </h2>
//         {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleLogin}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md"
//               >
//                 Login
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


