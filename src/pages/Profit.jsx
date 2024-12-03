import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectProfitForToday,
  selectProfitForThisWeek,
  selectProfitForThisMonth,
  selectProfitOverall,
  selectSalesLoading,
  selectSalesError
} from '../store/slices/salesSlice'; 
import { toast } from 'react-toastify';

export default function Profit() {
  const dispatch = useDispatch();
  const [view, setView] = useState('daily');

  const profitForToday = useSelector(selectProfitForToday);
  const profitForThisWeek = useSelector(selectProfitForThisWeek);
  const profitForThisMonth = useSelector(selectProfitForThisMonth);
  const profitOverall = useSelector(selectProfitOverall);
  
  const loading = useSelector(selectSalesLoading);
  const error = useSelector(selectSalesError);

  useEffect(() => {
    if (!profitForToday || !profitForThisWeek || !profitForThisMonth || !profitOverall) {
      dispatch(fetchSales());
    }
  }, [dispatch, profitForToday, profitForThisWeek, profitForThisMonth, profitOverall]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  const getProfitData = () => {
    const data = {
      daily: profitForToday,
      weekly: profitForThisWeek,
      monthly: profitForThisMonth,
      overall: profitOverall,
    }[view];

    return Array.isArray(data) ? data : [];  // Return an empty array if it's not an array
  };

  return (
    <div className="h-[calc(100vh-6rem)] p-6">
      <h2 className="text-2xl font-semibold mb-4">Profit Overview</h2>

      {loading ? (
        <p>Loading profit data...</p>
      ) : (
        <div className="space-y-4">
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

          {getProfitData().length === 0 ? (
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
