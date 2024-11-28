import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales, selectSalesForToday } from '../store/slices/salesSlice'; // Updated import

const TodaysSales = () => {
  const dispatch = useDispatch();
  const todaysSales = useSelector(selectSalesForToday); // Correct selector for today's sales
  const loading = useSelector((state) => state.sales.loading);
  const error = useSelector((state) => state.sales.error);

  const [hoveredSale, setHoveredSale] = useState(null); // State to track the hovered sale for more details

  // Calculate the total sales for today
  const totalSales = todaysSales.reduce((acc, sale) => acc + sale.total, 0).toFixed(2);

  useEffect(() => {
    dispatch(fetchSales()); // Fetch all sales data when the component mounts
  }, [dispatch]);

  return (
    <div>
      {loading && <p>Loading...</p>} {/* Loading indicator */}
      {error && <p className="text-red-600">{error}</p>} {/* Error message */}

      {/* Today's Total Sales */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold">Today's Total Sales</h2>
        <p className="text-lg font-medium text-gray-900">Ksh {totalSales}</p>
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
                  onMouseEnter={() => setHoveredSale(sale.id)}  // Set hovered sale on hover
                  onMouseLeave={() => setHoveredSale(null)}  // Reset hovered sale when mouse leaves
                >
                  <td className="px-6 py-4 text-sm text-gray-800">{sale.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">Ksh {sale.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{sale.payment_method}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(sale.timestamp).toLocaleString()}
                  </td>

                  {/* Display additional details when hovered */}
                  {hoveredSale === sale.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="px-6 py-4 text-sm text-gray-700">
                        <strong>Products Sold:</strong>
                        <div className="mt-2">
                          {sale.products && sale.products.length > 0 ? (
                            <ul>
                              {sale.products.map((product, index) => (
                                <li key={index} className="text-sm text-gray-700">
                                  <strong>{product.name}</strong> - Quantity: {product.quantity}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No products recorded for this sale.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-sm text-gray-800 text-center">No sales recorded for today.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodaysSales;

