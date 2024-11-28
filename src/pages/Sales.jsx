import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSales } from '../store/slices/salesSlice';
import { 
  selectSales, 
  selectSalesForToday, 
  selectSalesForThisWeek, 
  selectSalesForThisMonth, 
  calculateTotalSales, 
  selectSalesLoading, 
  selectSalesError 
} from '../store/slices/salesSlice';  // Ensure correct imports

export default function Sales() {
  const dispatch = useDispatch();
  const [view, setView] = useState('daily');  // View state to toggle between daily, weekly, monthly, and overall
  const sales = useSelector(selectSales);  // Get all sales data
  const salesForToday = useSelector(selectSalesForToday);  // Today's sales
  const salesForThisWeek = useSelector(selectSalesForThisWeek);  // This week's sales
  const salesForThisMonth = useSelector(selectSalesForThisMonth);  // This month's sales
  const loading = useSelector(selectSalesLoading); // Get loading state
  const error = useSelector(selectSalesError); // Get error state

  // Fetch sales data from the backend when the component mounts
  useEffect(() => {
    dispatch(fetchSales()); // Dispatch action to fetch sales data
  }, [dispatch]);

  // Display errors if they occur
  useEffect(() => {
    if (error) {
      toast.error(`Error: Ksh{error}`);
    }
  }, [error]);

  // Helper function to render sales data in a table
  const renderSalesTable = (salesData) => (
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Sale ID</th>
          <th className="px-4 py-2 text-left">Date</th>
          <th className="px-4 py-2 text-left">Items</th>
          <th className="px-4 py-2 text-left">Total</th>
        </tr>
      </thead>
      <tbody>
        {salesData.map((sale) => (
          <tr key={sale.id}>
            <td className="px-4 py-2">{sale.id}</td>
            <td className="px-4 py-2">{new Date(sale.timestamp).toLocaleString()}</td>
            <td className="px-4 py-2">
              {sale.items?.map((item, index) => (
                <div key={`Ksh{item.product_id}-Ksh{index}`}>
                  {item.product_name} x{item.quantity} - Ksh{item.price ? item.price.toFixed(2) : 'N/A'}
                </div>
              ))}
            </td>
            <td className="px-4 py-2">Ksh{sale.total ? sale.total.toFixed(2) : 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Determine which sales data to display based on the selected view
  const getSalesData = () => {
    switch (view) {
      case 'daily':
        return salesForToday;
      case 'weekly':
        return salesForThisWeek;
      case 'monthly':
        return salesForThisMonth;
      case 'overall':
        return sales;
      default:
        return salesForToday;
    }
  };

  // Get the total sales for the selected period
  const getTotalSales = () => {
    switch (view) {
      case 'daily':
        return calculateTotalSales(salesForToday);
      case 'weekly':
        return calculateTotalSales(salesForThisWeek);
      case 'monthly':
        return calculateTotalSales(salesForThisMonth);
      case 'overall':
        return calculateTotalSales(sales);
      default:
        return calculateTotalSales(salesForToday);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] p-6">
      <h2 className="text-2xl font-semibold mb-4">Sales History</h2>

      {/* Loading state */}
      {loading ? (
        <p>Loading sales...</p>
      ) : (
        <div className="space-y-4">
          {/* View Toggle Buttons */}
          <div className="space-x-4 mb-4">
            <button onClick={() => setView('daily')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Today's Sales
            </button>
            <button onClick={() => setView('weekly')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              This Week's Sales
            </button>
            <button onClick={() => setView('monthly')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              This Month's Sales
            </button>
            <button onClick={() => setView('overall')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              All Sales
            </button>
          </div>

          {/* No sales available */}
          {getSalesData().length === 0 ? (
            <p>No sales recorded yet.</p>
          ) : (
            renderSalesTable(getSalesData())
          )}
        </div>
      )}

      {/* Sales Summary */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg">Sales Summary</h3>
        <div className="space-y-2">
          <p>
            <strong>Total Sales for Selected Period:</strong> Ksh{getTotalSales()}
          </p>
        </div>
      </div>
    </div>
  );
}
