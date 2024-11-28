import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'; // Social media icons
import { Link } from 'react-router-dom'; // For internal navigation

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Dynamically fetch the current year

  return (
    <footer className="bg-indigo-600 text-white shadow-lg">
      {/* Main container for footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* About Section */}
        <p className="text-sm text-gray-400 mb-4 md:mb-0">
          © {currentYear} Naneli Retail Shop. Empowering businesses with innovative solutions.
        </p>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white">
            Dashboard
          </Link>
          <Link to="/register" className="text-sm text-gray-400 hover:text-white">
            Register
          </Link>
          <Link to="/contact" className="text-sm text-gray-400 hover:text-white">
            Contact Us
          </Link>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://github.com/naneli-retail"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com/naneli-retail"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com/company/naneli-retail"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="mailto:support@naneli-retail.com"
            className="hover:text-white"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
