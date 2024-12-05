import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales, selectSalesForToday, selectSalesLoading, selectSalesError } from '../store/slices/salesSlice'; // Updated import
import { toast } from 'react-toastify'; // Assuming you're using toast for error messages

const TodaysSales = () => {
  const dispatch = useDispatch();

  // Fetch sales data
  const todaysSales = useSelector(selectSalesForToday); // Get today's sales
  const loading = useSelector(selectSalesLoading); // Check loading state
  const error = useSelector(selectSalesError); // Check for any error
  
  const [view, setView] = useState('daily'); // State to manage the selected view (although it's only daily for now)

  // Calculate total sales for today using the sales slice logic
  const totalSales = todaysSales.reduce((total, sale) => total + sale.total, 0).toFixed(2);

  // Fetch sales when the component mounts
  useEffect(() => {
    dispatch(fetchSales()); // Fetch sales data
  }, [dispatch]);

  // Display errors if they occur
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  return (
    <div className="h-[calc(100vh-6rem)] p-6">
      <h2 className="text-2xl font-semibold mb-4">Today's Sales</h2>

      {/* Loading state */}
      {loading && <p>Loading sales...</p>}

      {/* Error state */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Today's Total Sales */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-xl font-semibold">Today's Total Sales</h3>
        <p className="text-lg font-medium text-gray-900">$ {totalSales}</p>
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Sale ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Total</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Payment Method</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {todaysSales.length > 0 ? (
              todaysSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">{sale.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">$ {sale.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{sale.payment_method}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(sale.timestamp).toLocaleString()}
                  </td>

                  {/* Display additional details on hover */}
                  {sale.products && sale.products.length > 0 && (
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="px-6 py-4 text-sm text-gray-700">
                        <strong>Products Sold:</strong>
                        <div className="mt-2">
                          <ul>
                            {sale.products.map((product, index) => (
                              <li key={index} className="text-sm text-gray-700">
                                <strong>{product.name}</strong> - Quantity: {product.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-sm text-gray-800 text-center">
                  No sales recorded for today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodaysSales;



