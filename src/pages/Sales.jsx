import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSales } from '../store/slices/salesSlice';
import {
  selectSales,
  selectSalesForToday,
  selectSalesForThisWeek,
  selectSalesForThisMonth,
  selectProfitOverall,
  selectSalesLoading,
  selectSalesError,
  selectSelectedDate
} from '../store/slices/salesSlice';  // Ensure correct imports
import { toast } from 'react-toastify';
import { useTable, useExpanded } from 'react-table';

export default function Sales() {
  const dispatch = useDispatch();
  const [view, setView] = useState('daily');  // View state to toggle between daily, weekly, monthly, and overall

  // Get all sales data for various periods
  const sales = useSelector(selectSales);  // Get all sales data
  const salesForToday = useSelector(selectSalesForToday);  // Today's sales
  const salesForThisWeek = useSelector(selectSalesForThisWeek);  // This week's sales
  const salesForThisMonth = useSelector(selectSalesForThisMonth);  // This month's sales
  const profitOverall = useSelector(selectProfitOverall);  // Overall profit
  const loading = useSelector(selectSalesLoading); // Get loading state
  const error = useSelector(selectSalesError); // Get error state from Redux
  const selectedDate = useSelector(selectSelectedDate); // Get the selected date (for filtered sales)

  // Fetch sales data from the backend when the component mounts
  useEffect(() => {
    dispatch(fetchSales()); // Dispatch action to fetch sales data
  }, [dispatch]);

  // Display errors if they occur
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`); // Use react-toastify to show error messages
    }
  }, [error]);

  // Helper function to calculate total sales for a period
  const calculateTotalSales = (sales) => {
    return sales.reduce((total, sale) => total + (sale.total || 0), 0).toFixed(2);
  };

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

  // Get the profit for the selected period based on the state
  const getProfit = () => {
    switch (view) {
      case 'daily':
        return calculateTotalSales(salesForToday);  // Profit based on selected sales
      case 'weekly':
        return calculateTotalSales(salesForThisWeek);
      case 'monthly':
        return calculateTotalSales(salesForThisMonth);
      case 'overall':
        return profitOverall;
      default:
        return calculateTotalSales(salesForToday);
    }
  };

  // Table Columns Definition
  const columns = React.useMemo(
    () => [
      {
        Header: 'Sale ID',
        accessor: 'id', // Access the sale id from the data
      },
      {
        Header: 'Date',
        accessor: 'timestamp', // Access the sale timestamp
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: 'Total',
        accessor: 'total', // Access the total sale amount
        Cell: ({ value }) => `Kshs ${value ? value.toFixed(2) : 'N/A'}`,
      },
      {
        Header: 'Items',
        accessor: 'items', // Items per sale
        Cell: ({ row }) => (
          <button {...row.getToggleRowExpandedProps()} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            {row.isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
        ),
      },
    ],
    []
  );

  // Table instance using useTable and useExpanded hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: getSalesData(),
    },
    useExpanded // Use the useExpanded hook for expandable rows
  );

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Sales History</h2>

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
            <table {...getTableProps()} className="min-w-full table-auto">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} key={column.id} className="px-4 py-2 text-left text-indigo-700">
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row);
                  return (
                    <React.Fragment key={row.id}>
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => (
                          <td {...cell.getCellProps()} key={cell.column.id} className="px-4 py-2 text-indigo-900">
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                      {/* Expanded Row for Item Details */}
                      {row.isExpanded ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-2 bg-indigo-50">
                            <table className="min-w-full table-auto">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 text-indigo-700">Product Name</th>
                                  <th className="px-4 py-2 text-indigo-700">Quantity</th>
                                  <th className="px-4 py-2 text-indigo-700">Price</th>
                                  <th className="px-4 py-2 text-indigo-700">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.original.items?.map((item, index) => (
                                  <tr key={index}>
                                    <td className="px-4 py-2">{item.product_name}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">{item.price.toFixed(2)}</td>
                                    <td className="px-4 py-2">{(item.price * item.quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Sales and Profit Summary */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-600">Sales Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm">
            <h4 className="text-lg font-medium text-indigo-700">Total Sales</h4>
            <p className="text-2xl font-bold text-indigo-900">
              Kshs {getTotalSales()}
            </p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm">
            <h4 className="text-lg font-medium text-indigo-700">Total Profit</h4>
            <p className="text-2xl font-bold text-indigo-900">
              Kshs {getProfit()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}