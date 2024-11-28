import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', // Role field
    adminSecret: '', // Admin secret field
  });
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.role) {
      setError('Please select a role');
      return;
    }

    if (formData.role === 'admin' && !formData.adminSecret) {
      setError('Please provide the admin secret');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(
          data.message || 'Registration successful! Please check your email for the verification code.'
        );
        setIsVerificationStep(true);
        setError('');
      } else {
        setError(data.error || 'An error occurred during registration');
      }
    } catch (err) {
      setError('Failed to register. Please try again later.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!/^\d{6}Ksh/.test(verificationCode)) {
      setVerificationMessage('Verification code must be exactly 6 digits');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setVerificationMessage('Verification successful!');
        setError('');
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
      } else {
        setVerificationMessage(data.error || 'Verification failed');
      }
    } catch (err) {
      setVerificationMessage('Failed to verify. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start bg-gray-50 pt-16"> {/* Updated background color */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-extrabold text-indigo-700"> {/* Larger, bolder header */}
          {isVerificationStep ? 'Verify Your Account' : 'Create Your Account'}
        </h2>

        {/* Updated Welcome message with more engaging language */}
        <p className="mt-4 text-center text-xl text-gray-800">
          {isVerificationStep ? (
            'We’ve sent a verification code to your email. Please enter it below to complete your registration.'
          ) : (
            'Welcome to our platform! Fill out the form below to create your account and start enjoying all the features we offer.'
          )}
        </p>

        {/* Links to Home and Login */}
        {!isVerificationStep && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Log in here
            </a>
            <br />
            Or go back to the{' '}
            <a
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Home page
            </a>
          </p>
        )}

        {/* Error and Success Messages */}
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
        {verificationMessage && (
          <p className="mt-4 text-center text-sm text-blue-600">{verificationMessage}</p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!isVerificationStep ? (
            <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" // Focus color added
                />
              </div>

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
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" // Focus color added
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
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" // Focus color added
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" // Focus color added
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Select Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" // Focus color added
                >
                  <option value="">-- Select Role --</option>
                  <option value="admin">Admin</option>
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              {/* Show Admin Secret Input if Role is Admin */}
              {formData.role === 'admin' && (
                <div>
                  <label htmlFor="adminSecret" className="block text-sm font-medium text-gray-700">
                    Admin Secret
                  </label>
                  <input
                    id="adminSecret"
                    name="adminSecret"
                    type="password"
                    value={formData.adminSecret}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" // Focus color added
                  />
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Register
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyCode}>
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setVerificationMessage(''); // Clear previous messages on input change
                  }}
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter 6-digit code"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Verify Code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


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
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage(
//           data.message || 'Registration successful! Please check your email for the verification code.'
//         );
//         setIsVerificationStep(true);
//         setError('');
//       } else {
//         setError(data.error || 'An error occurred during registration');
//       }
//     } catch (err) {
//       setError('Failed to register. Please try again later.');
//     }
//   };

//   const handleVerifyCode = async (e) => {
//     e.preventDefault();

//     if (!/^\d{6}Ksh/.test(verificationCode)) {
//       setVerificationMessage('Verification code must be exactly 6 digits');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/verify', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ code: verificationCode }),
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
//       setVerificationMessage('Failed to verify. Please try again later.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-start bg-gray-100 pt-[200px]"> {/* Increased padding to 50px */}
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-bold text-gray-900">
//           {isVerificationStep ? 'Verify Your Account' : 'Create Your Account'}
//         </h2>

//         {/* Welcome message */}
//         <p className="mt-2 text-center text-sm text-gray-600">
//           {isVerificationStep ? (
//             'We’ve sent a verification code to your email. Please enter it below.'
//           ) : (
//             'Welcome! Fill out the form below to create your account.'
//           )}
//         </p>

//         {/* Links to Home and Login */}
//         {!isVerificationStep && (
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <a
//               href="/login"
//               className="font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               Log in here
//             </a>
//             <br />
//             Or go back to the{' '}
//             <a
//               href="/"
//               className="font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               Home page
//             </a>
//           </p>
//         )}

//         {/* Error and Success Messages */}
//         {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
//         {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
//         {verificationMessage && (
//           <p className="mt-2 text-center text-sm text-blue-600">{verificationMessage}</p>
//         )}
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
//                   className="mt-1 block w-full px-3 py-2 border rounded-md"
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
//                   className="mt-1 block w-full px-3 py-2 border rounded-md"
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
//                   className="mt-1 block w-full px-3 py-2 border rounded-md"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="confirmPassword"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Confirm Password
//                 </label>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full px-3 py-2 border rounded-md"
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
//                   className="mt-1 block w-full px-3 py-2 border rounded-md"
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
//                     className="mt-1 block w-full px-3 py-2 border rounded-md"
//                   />
//                 </div>
//               )}

//               <div>
//                 <button
//                   type="submit"
//                   className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md"
//                 >
//                   Register
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <form className="space-y-6" onSubmit={handleVerifyCode}>
//               <div>
//                 <label
//                   htmlFor="verificationCode"
//                   className="block text-sm font-medium text-gray-700"
//                 >
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
//                   className="mt-1 block w-full px-3 py-2 border rounded-md"
//                   placeholder="Enter 6-digit code"
//                 />
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md"
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
