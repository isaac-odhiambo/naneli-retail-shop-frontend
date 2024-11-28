import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Box, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            <span className="block">Streamline Your</span>
            <span className="block text-indigo-600">Retail Operations</span>
          </h1>
          <p className="mt-3 sm:text-lg md:text-xl text-gray-500 sm:max-w-3xl mx-auto">
            Manage inventory, track sales, and grow your business efficiently with Naneli Retail Shop.
          </p>
          <div className="mt-5 sm:flex sm:justify-center">
            <div className="rounded-md shadow">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3 rounded-md shadow">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Everything you need to manage your retail shop
            </p>
          </div>

          <div className="mt-10">
            {/* Using Tailwind's grid system to make the layout responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Feature 1: Manage Inventory */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Box className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Manage Inventory</p>
                  <p className="mt-2 text-base text-gray-500">
                    Keep track of stock levels, set reorder points, and never run out of your best-selling items.
                  </p>
                </div>
              </div>

              {/* Feature 2: Track Sales */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <TrendingUp className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Track Sales</p>
                  <p className="mt-2 text-base text-gray-500">
                    Monitor daily, weekly, and monthly sales to identify trends and maximize profits.
                  </p>
                </div>
              </div>

              {/* Feature 3: Process Orders */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Process Orders</p>
                  <p className="mt-2 text-base text-gray-500">
                    Quickly and efficiently handle customer orders with our intuitive POS system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
