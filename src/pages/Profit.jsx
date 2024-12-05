
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTable } from 'react-table';
import { Calendar, CalendarCheck, CalendarRange } from 'lucide-react';
import {
  fetchSales,  // Import the async action to fetch sales
  selectProfitOverall,
  selectFilteredProfit,
  selectSalesForToday,
  selectSalesForThisWeek,
  selectSalesForThisMonth,
  setSelectedDate,
} from '../store/slices/salesSlice'; // Import necessary actions and selectors

const Profit = () => {
  const dispatch = useDispatch();

  // Redux state
  const overallProfit = useSelector(selectProfitOverall); // Total profit for all sales
  const filteredProfit = useSelector(selectFilteredProfit); // Profit for selected filter (today/week/month)
  const salesForToday = useSelector(selectSalesForToday);
  const salesForThisWeek = useSelector(selectSalesForThisWeek);
  const salesForThisMonth = useSelector(selectSalesForThisMonth);

  const [selectedOption, setSelectedOption] = useState('Overall');
  const [isLoading, setIsLoading] = useState(true); // Loading state for sales fetch

  // Fetch sales data when the component mounts
  useEffect(() => {
    dispatch(fetchSales()) // Dispatch the fetchSales action to get sales data
      .unwrap()
      .then(() => setIsLoading(false)) // On success, set loading to false
      .catch(() => setIsLoading(false)); // On error, set loading to false
  }, [dispatch]);

  // Handling the profit calculations based on the selected date
  let data = [];
  switch (selectedOption) {
    case 'Today':
      data = salesForToday;
      break;
    case 'This Week':
      data = salesForThisWeek;
      break;
    case 'This Month':
      data = salesForThisMonth;
      break;
    case 'Overall':
    default:
      data = []; // Empty data because we are calculating overall profit
      break;
  }

  // Calculate profit for each sale
  const calculateProfitForSale = (sale) => {
    return sale.items.reduce((totalProfit, item) => {
      return (item.price - item.product_cost) * item.quantity + totalProfit;
    }, 0);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Sale ID',
        accessor: 'id', // Accessor for sale ID
      },
      {
        Header: 'Items Sold',
        accessor: 'items',
        Cell: ({ value }) => value.length, // Showing the number of items in the sale
      },
      {
        Header: 'Profit',
        accessor: (row) => calculateProfitForSale(row), // Calculate profit for each row
        Cell: ({ value }) => `Kshs ${value.toFixed(2)}`, // Format profit as currency
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  useEffect(() => {
    // Dispatch action to reset selected date and filtered profit
    dispatch(setSelectedDate(null));
  }, [dispatch]);

  // Handle the date selection for filtering
  const handleDateSelection = (dateOption) => {
    setSelectedOption(dateOption);
    dispatch(setSelectedDate(dateOption));
  };

  // Helper function to safely format the profit as a string
  const formatProfit = (profit) => {
    if (typeof profit !== 'number' || isNaN(profit)) {
      return '$0.00';
    }
    return `$${profit.toFixed(2)}`;
  };

  // Update filtered profit based on the selected option
  const calculateFilteredProfit = () => {
    let totalProfit = 0;

    const currentData = selectedOption === 'Overall' 
      ? [] // Here we calculate total profit from all sales
      : data;

    if (currentData.length > 0) {
      totalProfit = currentData.reduce((acc, sale) => {
        return acc + calculateProfitForSale(sale);
      }, 0);
    }

    return totalProfit;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profit Overview and Date Selection */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Profit Overview</h2>

        {/* Filter Buttons */}
        <div className="space-x-4 mb-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => handleDateSelection('Overall')}
          >
            <Calendar className="inline mr-2" /> Overall
          </button>
          <button
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => handleDateSelection('Today')}
          >
            <CalendarCheck className="inline mr-2" /> Today
          </button>
          <button
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => handleDateSelection('This Week')}
          >
            <CalendarRange className="inline mr-2" /> This Week
          </button>
          <button
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => handleDateSelection('This Month')}
          >
            <CalendarRange className="inline mr-2" /> This Month
          </button>
        </div>

        {/* Total Profit Display */}
        <div className="mb-6">
          <h4 className="text-lg font-medium">Total Profit:</h4>
          <div className="text-2xl font-semibold text-green-600">
            {formatProfit(calculateFilteredProfit())}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center text-gray-500">Loading sales data...</div>
      ) : (
        <>
          {/* Table for displaying sales profit */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table {...getTableProps()} className="min-w-full table-auto border-collapse">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} className="border-b bg-gray-100">
                    {headerGroup.headers.map(column => {
                      const { id, ...rest } = column.getHeaderProps();
                      return (
                        <th
                          key={id}
                          {...rest}
                          className="px-4 py-2 text-left font-semibold text-gray-700"
                        >
                          {column.render('Header')}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row);
                  const { id, ...rest } = row.getRowProps();
                  return (
                    <tr key={id} {...rest} className="border-b hover:bg-gray-50">
                      {row.cells.map(cell => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="px-4 py-2 text-sm text-gray-700"
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Profit;


