import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'; // Social media icons
import { Link } from 'react-router-dom'; // For internal navigation

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Dynamically fetch the current year

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white shadow-lg py-4" 
      aria-labelledby="footer-info"
    >
      <section id="footer-info" role="contentinfo" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        
        {/* About Section */}
        <p className="text-xs text-gray-400 mb-2 md:mb-0 text-center md:text-left">
          © {currentYear} Naneli Retail Shop. Empowering businesses with innovative solutions.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 text-center sm:text-left">
          <Link 
            to="/dashboard" 
            className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Go to Dashboard"
          >
            Dashboard
          </Link>
          <Link 
            to="/register" 
            className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Go to Register page"
          >
            Register
          </Link>
          <Link 
            to="/contact" 
            className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Contact us"
          >
            Contact Us
          </Link>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 md:mt-0 text-center sm:text-left">
          <a
            href="https://github.com/naneli-retail"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
            aria-label="Visit our GitHub page"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://twitter.com/naneli-retail"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
            aria-label="Visit our Twitter page"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com/company/naneli-retail"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
            aria-label="Visit our LinkedIn page"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="mailto:support@naneli-retail.com"
            className="hover:text-white transition-colors duration-200"
            aria-label="Send an email to support"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </section>
    </footer>
  );
}

