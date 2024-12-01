import React from 'react';
import { Link } from 'react-router-dom'; // For navigation (optional)

function DashboardCard({ title, value, icon, trend, link }) {
  // Determine if the trend is positive or negative
  const isPositive = trend && trend.startsWith('+');
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <Link 
      to={link} 
      className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
          {icon}  {/* Display the passed icon */}
        </div>
      </div>
      {trend && (
        <p className={`mt-4 text-sm font-medium ${trendColor}`}>
          {trend}  {/* Display the trend percentage */}
        </p>
      )}
    </Link>
  );
}

export default DashboardCard;
