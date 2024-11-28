// src/pages/TodaysSalesPage.jsx
import React from 'react';
import TodaysSales from '../components/TodaysSales'; // Import the reusable component

const TodaysSalesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Today's Sales</h1>
      <TodaysSales />
    </div>
  );
};

export default TodaysSalesPage;
