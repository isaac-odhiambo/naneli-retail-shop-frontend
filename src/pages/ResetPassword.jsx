import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams(); // Get the token from the URL
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://naneli-backend.onrender.com/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError('');
      } else {
        setError(data.error || 'An error occurred');
        setMessage('');
      }
    } catch (err) {
      setError('Failed to reset password. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                required
                value={formData.new_password}
                onChange={(e) =>
                  setFormData({ ...formData, new_password: e.target.value })
                }
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                value={formData.confirm_password}
                onChange={(e) =>
                  setFormData({ ...formData, confirm_password: e.target.value })
                }
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
 