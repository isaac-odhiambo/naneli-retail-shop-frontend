/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react'; // Dynamically import all icons

const IconSearch = ({ selectedIcon, setSelectedIcon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce effect for search term
  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 300); // Debounce time 300ms

      return () => clearTimeout(timer);
    }
  }, [searchTerm, isSearching]);

  // Filter icons based on search term
  const filteredIcons = Object.keys(Icons).filter((icon) =>
    icon.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Handle icon click (selection)
  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
    setSearchTerm('');  // Clear search term after selection
    setIsSearching(false);  // Stop searching after selection
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search for an icon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsSearching(true)}  // Trigger search when focus is on the input
        className="w-full p-2 border border-gray-300 rounded"
      />

      {isSearching && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {filteredIcons.length > 0 ? (
            filteredIcons.map((icon) => {
              const IconComponent = Icons[icon];

              // Ensure the icon is a valid React component
              if (typeof IconComponent !== 'function') return null;

              return (
                <div
                  key={icon}
                  role="button"
                  aria-label={`Select ${icon} icon`}
                  className="cursor-pointer hover:text-indigo-600"
                  onClick={() => handleIconClick(icon)} // Set selected icon
                >
                  <IconComponent className="h-6 w-6" />
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 col-span-4">No icons found</div>
          )}
        </div>
      )}

      {/* Show selected icon */}
      {selectedIcon && !isSearching && (
        <div className="mt-2 text-sm text-gray-700">
          <strong>Selected Icon:</strong> {selectedIcon}
        </div>
      )}
    </div>
  );
};

export default IconSearch;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: '', // Role field
//     adminSecret: '', // Admin secret field
//   });
//   const [isVerificationStep, setIsVerificationStep] = useState(false);
//   const [verificationCode, setVerificationCode] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [verificationMessage, setVerificationMessage] = useState('');
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
  
//     // Basic validation
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }
  
//     if (!formData.role) {
//       setError('Please select a role');
//       return;
//     }
  
//     if (formData.role === 'admin' && !formData.adminSecret) {
//       setError('Please provide the admin secret');
//       return;
//     }
  
//     try {
//       const response = await fetch('http://localhost:5000/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//         credentials: 'include',  // Make sure the session cookie is sent with the request
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         setMessage(data.message || 'Registration successful! Please check your email for the verification code.');
//         setIsVerificationStep(true);  // Transition to verification step
//         setError('');
//       } else {
//         setError(data.error || 'An error occurred during registration');
//       }
//     } catch (err) {
//       console.error('Registration error:', err);  // Log for debugging
//       setError('Failed to register. Please try again later.');
//     }
//   };
  
//   const handleVerifyCode = async (e) => {
//     e.preventDefault();
  
//     // Validate verification code (must be 6 digits)
//     if (!/^\d{6}$/.test(verificationCode)) {
//       setVerificationMessage('Verification code must be exactly 6 digits');
//       return;
//     }
  
//     console.log('Verification code submitted:', verificationCode); // Debugging
  
//     try {
//       const response = await fetch('http://localhost:5000/verify', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           code: verificationCode,  // Send the 6-digit verification code
//           email: formData.email     // Send the email used during registration
//         }),
//         credentials: 'include',  // Make sure the session cookie is sent with the request
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         setVerificationMessage('Verification successful!');
//         setError('');
//         setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
//       } else {
//         setVerificationMessage(data.error || 'Verification failed');
//       }
//     } catch (err) {
//       console.error('Verification error:', err);  // Log for debugging
//       setVerificationMessage('Failed to verify. Please try again later.');
//     }
//   };
//   // const handleVerifyCode = async (e) => {
//   //   e.preventDefault();

//   //   // Validate verification code (must be 6 digits)
//   //   if (!/^\d{6}$/.test(verificationCode)) {
//   //     setVerificationMessage('Verification code must be exactly 6 digits');
//   //     return;
//   //   }

//   //   try {
//   //     const response = await fetch('http://localhost:5000/verify', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({
//   //         code: verificationCode,      // Send the 6-digit verification code
//   //         email: formData.email         // Send the email used during registration
//   //       }),
//   //     });

//   //     const data = await response.json();
//   //     if (response.ok) {
//   //       setVerificationMessage('Verification successful!');
//   //       setError('');
//   //       setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
//   //     } else {
//   //       setVerificationMessage(data.error || 'Verification failed');
//   //     }
//   //   } catch (err) {
//   //     setVerificationMessage('Failed to verify. Please try again later.');
//   //   }
//   // };

//   return (
//     <div className="min-h-screen flex flex-col justify-start bg-gray-50 pt-16">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-4xl font-extrabold text-indigo-700">
//           {isVerificationStep ? 'Verify Your Account' : 'Create Your Account'}
//         </h2>

//         <p className="mt-4 text-center text-xl text-gray-800">
//           {isVerificationStep ? (
//             'We’ve sent a verification code to your email. Please enter it below to complete your registration.'
//           ) : (
//             'Welcome to our platform! Fill out the form below to create your account and start enjoying all the features we offer.'
//           )}
//         </p>

//         {/* Links to Home and Login */}
//         {!isVerificationStep && (
//           <p className="mt-4 text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
//               Log in here
//             </a>
//             <br />
//             Or go back to the{' '}
//             <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
//               Home page
//             </a>
//           </p>
//         )}

//         {/* Error and Success Messages */}
//         {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
//         {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
//         {verificationMessage && <p className="mt-4 text-center text-sm text-blue-600">{verificationMessage}</p>}
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {!isVerificationStep ? (
//             <form className="space-y-6" onSubmit={handleRegister}>
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                   Username
//                 </label>
//                 <input
//                   id="username"
//                   name="username"
//                   type="text"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email Address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                   Confirm Password
//                 </label>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                   Select Role
//                 </label>
//                 <select
//                   id="role"
//                   name="role"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="">-- Select Role --</option>
//                   <option value="admin">Admin</option>
//                   <option value="cashier">Cashier</option>
//                   <option value="manager">Manager</option>
//                 </select>
//               </div>

//               {/* Show Admin Secret Input if Role is Admin */}
//               {formData.role === 'admin' && (
//                 <div>
//                   <label htmlFor="adminSecret" className="block text-sm font-medium text-gray-700">
//                     Admin Secret
//                   </label>
//                   <input
//                     id="adminSecret"
//                     name="adminSecret"
//                     type="password"
//                     value={formData.adminSecret}
//                     onChange={handleInputChange}
//                     required
//                     className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//               )}

//               <div>
//                 <button
//                   type="submit"
//                   className="w-full py-3 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
//                 >
//                   Register
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <form className="space-y-6" onSubmit={handleVerifyCode}>
//               <div>
//                 <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
//                   Verification Code
//                 </label>
//                 <input
//                   id="verificationCode"
//                   name="verificationCode"
//                   type="text"
//                   value={verificationCode}
//                   onChange={(e) => {
//                     setVerificationCode(e.target.value);
//                     setVerificationMessage(''); // Clear previous messages on input change
//                   }}
//                   required
//                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Enter 6-digit code"
//                 />
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   className="w-full py-3 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
//                 >
//                   Verify Code
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // export default function Register() {
// //   const [formData, setFormData] = useState({
// //     username: '',
// //     email: '',
// //     password: '',
// //     confirmPassword: '',
// //     role: '', // Role field
// //     adminSecret: '', // Admin secret field
// //   });
// //   const [isVerificationStep, setIsVerificationStep] = useState(false);
// //   const [verificationCode, setVerificationCode] = useState('');
// //   const [error, setError] = useState('');
// //   const [message, setMessage] = useState('');
// //   const [verificationMessage, setVerificationMessage] = useState('');
// //   const navigate = useNavigate();

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   const handleRegister = async (e) => {
// //     e.preventDefault();

// //     // Basic validation
// //     if (formData.password !== formData.confirmPassword) {
// //       setError('Passwords do not match');
// //       return;
// //     }

// //     if (!formData.role) {
// //       setError('Please select a role');
// //       return;
// //     }

// //     if (formData.role === 'admin' && !formData.adminSecret) {
// //       setError('Please provide the admin secret');
// //       return;
// //     }

// //     try {
// //       const response = await fetch('http://localhost:5000/register', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(formData),
// //       });

// //       const data = await response.json();
// //       if (response.ok) {
// //         setMessage(data.message || 'Registration successful! Please check your email for the verification code.');
// //         setIsVerificationStep(true);  // Transition to verification step
// //         setError('');
// //       } else {
// //         setError(data.error || 'An error occurred during registration');
// //       }
// //     } catch (err) {
// //       setError('Failed to register. Please try again later.');
// //     }
// //   };

// //   const handleVerifyCode = async (e) => {
// //     e.preventDefault();
  
// //     // Validate verification code (must be 6 digits)
// //     if (!/^\d{6}$/.test(verificationCode)) {
// //       setVerificationMessage('Verification code must be exactly 6 digits');
// //       return;
// //     }
  
// //     try {
// //       const response = await fetch('http://localhost:5000/verify', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ code: verificationCode }),
// //       });
  
// //       const data = await response.json();
// //       if (response.ok) {
// //         setVerificationMessage('Verification successful!');
// //         setError('');
// //         setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
// //       } else {
// //         setVerificationMessage(data.error || 'Verification failed');
// //       }
// //     } catch (err) {
// //       setVerificationMessage('Failed to verify. Please try again later.');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex flex-col justify-start bg-gray-50 pt-16">
// //       <div className="sm:mx-auto sm:w-full sm:max-w-md">
// //         <h2 className="text-center text-4xl font-extrabold text-indigo-700">
// //           {isVerificationStep ? 'Verify Your Account' : 'Create Your Account'}
// //         </h2>

// //         <p className="mt-4 text-center text-xl text-gray-800">
// //           {isVerificationStep ? (
// //             'We’ve sent a verification code to your email. Please enter it below to complete your registration.'
// //           ) : (
// //             'Welcome to our platform! Fill out the form below to create your account and start enjoying all the features we offer.'
// //           )}
// //         </p>

// //         {/* Links to Home and Login */}
// //         {!isVerificationStep && (
// //           <p className="mt-4 text-center text-sm text-gray-600">
// //             Already have an account?{' '}
// //             <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
// //               Log in here
// //             </a>
// //             <br />
// //             Or go back to the{' '}
// //             <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
// //               Home page
// //             </a>
// //           </p>
// //         )}

// //         {/* Error and Success Messages */}
// //         {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
// //         {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
// //         {verificationMessage && <p className="mt-4 text-center text-sm text-blue-600">{verificationMessage}</p>}
// //       </div>

// //       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
// //         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
// //           {!isVerificationStep ? (
// //             <form className="space-y-6" onSubmit={handleRegister}>
// //               <div>
// //                 <label htmlFor="username" className="block text-sm font-medium text-gray-700">
// //                   Username
// //                 </label>
// //                 <input
// //                   id="username"
// //                   name="username"
// //                   type="text"
// //                   value={formData.username}
// //                   onChange={handleInputChange}
// //                   required
// //                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
// //                 />
// //               </div>

// //               <div>
// //                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
// //                   Email Address
// //                 </label>
// //                 <input
// //                   id="email"
// //                   name="email"
// //                   type="email"
// //                   value={formData.email}
// //                   onChange={handleInputChange}
// //                   required
// //                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
// //                 />
// //               </div>

// //               <div>
// //                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
// //                   Password
// //                 </label>
// //                 <input
// //                   id="password"
// //                   name="password"
// //                   type="password"
// //                   value={formData.password}
// //                   onChange={handleInputChange}
// //                   required
// //                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
// //                 />
// //               </div>

// //               <div>
// //                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
// //                   Confirm Password
// //                 </label>
// //                 <input
// //                   id="confirmPassword"
// //                   name="confirmPassword"
// //                   type="password"
// //                   value={formData.confirmPassword}
// //                   onChange={handleInputChange}
// //                   required
// //                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
// //                 />
// //               </div>

// //               <div>
// //                 <label htmlFor="role" className="block text-sm font-medium text-gray-700">
// //                   Select Role
// //                 </label>
// //                 <select
// //                   id="role"
// //                   name="role"
// //                   value={formData.role}
// //                   onChange={handleInputChange}
// //                   required
// //                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
// //                 >
// //                   <option value="">-- Select Role --</option>
// //                   <option value="admin">Admin</option>
// //                   <option value="cashier">Cashier</option>
// //                   <option value="manager">Manager</option>
// //                 </select>
// //               </div>

// //               {/* Show Admin Secret Input if Role is Admin */}
// //               {formData.role === 'admin' && (
// //                 <div>
// //                   <label htmlFor="adminSecret" className="block text-sm font-medium text-gray-700">
// //                     Admin Secret
// //                   </label>
// //                   <input
// //                     id="adminSecret"
// //                     name="adminSecret"
// //                     type="password"
// //                     value={formData.adminSecret}
// //                     onChange={handleInputChange}
// //                     required
// //                     className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
// //                   />
// //                 </div>
// //               )}

// //               <div>
// //                 <button
// //                   type="submit"
// //                   className="w-full py-3 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
// //                 >
// //                   Register
// //                 </button>
// //               </div>
// //             </form>
// //           ) : (
// //             <form className="space-y-6" onSubmit={handleVerifyCode}>
// //               <div>
// //                 <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
// //                   Verification Code
// //                 </label>
// //                 <input
// //                   id="verificationCode"
// //                   name="verificationCode"
// //                   type="text"
// //                   value={verificationCode}
// //                   onChange={(e) => {
// //                     setVerificationCode(e.target.value);
// //                     setVerificationMessage(''); // Clear previous messages on input change
// //                   }}
// //                   required
// //                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
// //                   placeholder="Enter 6-digit code"
// //                 />
// //               </div>

// //               <div>
// //                 <button
// //                   type="submit"
// //                   className="w-full py-3 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
// //                 >
// //                   Verify Code
// //                 </button>
// //               </div>
// //             </form>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

