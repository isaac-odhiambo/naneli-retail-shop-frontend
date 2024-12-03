import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectProfitForToday,
  selectProfitForThisWeek,
  selectProfitForThisMonth,
  selectProfitOverall,
  selectSalesLoading,
  selectSalesError
} from '../store/slices/salesSlice'; // Ensure correct imports
import { toast } from 'react-toastify';

export default function Profit() {
  const dispatch = useDispatch();
  const [view, setView] = useState('daily');  // View state to toggle between daily, weekly, monthly, and overall

  // Profit Data for different periods
  const profitForToday = useSelector(selectProfitForToday);
  const profitForThisWeek = useSelector(selectProfitForThisWeek);
  const profitForThisMonth = useSelector(selectProfitForThisMonth);
  const profitOverall = useSelector(selectProfitOverall);
  
  // Loading and error states
  const loading = useSelector(selectSalesLoading);
  const error = useSelector(selectSalesError);

  // Fetch profit data from the backend when the component mounts (assuming fetchSales includes profit data)
  useEffect(() => {
    // Optionally, you could dispatch fetchSales here to load data if not already loaded
    if (!profitForToday || !profitForThisWeek || !profitForThisMonth || !profitOverall) {
      dispatch(fetchSales());
    }
  }, [dispatch, profitForToday, profitForThisWeek, profitForThisMonth, profitOverall]);

  // Display errors if they occur
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  // Determine which profit data to display based on the selected view
  const getProfitData = () => {
    switch (view) {
      case 'daily':
        return profitForToday;
      case 'weekly':
        return profitForThisWeek;
      case 'monthly':
        return profitForThisMonth;
      case 'overall':
        return profitOverall;
      default:
        return profitForToday;
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] p-6">
      <h2 className="text-2xl font-semibold mb-4">Profit Overview</h2>

      {/* Loading state */}
      {loading ? (
        <p>Loading profit data...</p>
      ) : (
        <div className="space-y-4">
          {/* View Toggle Buttons */}
          <div className="space-x-4 mb-4">
            <button onClick={() => setView('daily')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Today's Profit
            </button>
            <button onClick={() => setView('weekly')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              This Week's Profit
            </button>
            <button onClick={() => setView('monthly')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              This Month's Profit
            </button>
            <button onClick={() => setView('overall')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Overall Profit
            </button>
          </div>

          {/* No profit data available */}
          {getProfitData() === null ? (
            <p>No profit data available for this period.</p>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Profit for {view === 'daily' ? "Today" : view === 'weekly' ? "This Week" : view === 'monthly' ? "This Month" : "All Time"}</h3>
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Sale ID</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {getProfitData().map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-4 py-2">{sale.id}</td>
                      <td className="px-4 py-2">{new Date(sale.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-2">${sale.profit ? sale.profit.toFixed(2) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchSales, selectOverallProfit, selectDailyProfit, selectWeeklyProfit, selectSalesLoading, selectSalesError } from './salesSlice';

// const ProfitDisplay = () => {
//   const dispatch = useDispatch();
//   const overallProfit = useSelector(selectOverallProfit);
//   const dailyProfit = useSelector(selectDailyProfit);
//   const weeklyProfit = useSelector(selectWeeklyProfit);
//   const loading = useSelector(selectSalesLoading);
//   const error = useSelector(selectSalesError);

//   useEffect(() => {
//     dispatch(fetchSales());  // Fetch sales and calculate profit when the component mounts
//   }, [dispatch]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h2>Profit Overview</h2>
//       <div>
//         <strong>Overall Profit: </strong> ${overallProfit.toFixed(2)}
//       </div>
//       <div>
//         <strong>Daily Profit: </strong> ${dailyProfit.toFixed(2)}
//       </div>
//       <div>
//         <strong>Weekly Profit: </strong> ${weeklyProfit.toFixed(2)}
//       </div>
//     </div>
//   );
// };

// export default Profit;
