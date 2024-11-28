import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>
      <p className="text-gray-600 text-center mb-6">
        Have a question or feedback? We'd love to hear from you!
      </p>

      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Comment</label>
          <textarea
            name="comment"
            required
            rows="4"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold"
        >
          Submit
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">Alternatively, you can reach us at:</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a
            href="mailto:info@moringaschool.com"
            className="text-indigo-600 hover:text-indigo-700"
          >
            info@moringaschool.com
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Twitter
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
