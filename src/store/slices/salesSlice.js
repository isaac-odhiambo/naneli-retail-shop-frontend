import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSelector } from 'reselect';
import { selectCurrentUser, selectIsAuthenticated } from './authSlice';

// Async thunk to fetch all sales (only if authenticated)
export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const user = selectCurrentUser(state);  // Get current user from auth slice
    const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

    if (!isAuthenticated || !user) {
      return rejectWithValue('No session found, please log in first.');
    }

    try {
      const response = await axios.get('http://localhost:5000/sales', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      return rejectWithValue(message);
    }
  }
);

// Helper function to calculate profit for each sale
const calculateProfitForSale = (sale) => {
  if (!sale.items || sale.items.length === 0) return 0;

  return sale.items.reduce((totalProfit, item) => {
    if (!item.price || !item.product_cost || !item.quantity) return totalProfit;
    const itemProfit = (item.price - item.product_cost) * item.quantity;
    return totalProfit + itemProfit;
  }, 0);
};

// Helper function to calculate total profit for a list of sales
const calculateTotalProfit = (sales) => {
  return sales.reduce((total, sale) => total + calculateProfitForSale(sale), 0).toFixed(2);
};

// Select sales for today, this week, and this month
export const selectSales = (state) => state.sales.sales;

export const selectSalesForToday = createSelector([selectSales], (sales) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  return sales.filter((sale) => {
    const saleDate = new Date(sale.timestamp);
    return saleDate >= startOfDay && saleDate <= endOfDay;
  });
});

export const selectSalesForThisWeek = createSelector([selectSales], (sales) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
  startOfWeek.setHours(0, 0, 0, 0); // Start of week
  const endOfWeek = new Date(today.setDate(today.getDate() + (6 - dayOfWeek))); // End of week
  endOfWeek.setHours(23, 59, 59, 999);
  return sales.filter((sale) => {
    const saleDate = new Date(sale.timestamp);
    return saleDate >= startOfWeek && saleDate <= endOfWeek;
  });
});

export const selectSalesForThisMonth = createSelector([selectSales], (sales) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  return sales.filter((sale) => {
    const saleDate = new Date(sale.timestamp);
    return saleDate >= startOfMonth && saleDate <= endOfMonth;
  });
});

// Select overall profit (for all sales)
export const selectProfitOverall = createSelector([selectSales], (sales) => calculateTotalProfit(sales));

// Select filtered profit based on selected date
export const selectFilteredProfit = (state) => state.sales.filteredProfit;

// Select error state for sales
export const selectSalesError = (state) => state.sales.error;

// Select loading state for sales
export const selectSalesLoading = (state) => state.sales.loading;

// Select selected date from the state
export const selectSelectedDate = (state) => state.sales.selectedDate; // <-- The missing selector!

// Create the sales slice
const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    sales: [],
    totalProfit: 0,
    filteredProfit: 0,
    error: null,  // The error state is used here
    loading: false,
    selectedDate: null,
  },
  reducers: {
    setTotalProfit: (state, action) => {
      state.totalProfit = action.payload;
    },
    setFilteredProfit: (state, action) => {
      state.filteredProfit = action.payload;
    },
    recordSale: (state, action) => {
      const newSale = action.payload;
      state.sales.push(newSale);
      state.totalProfit = calculateTotalProfit(state.sales);
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    resetFilteredProfit: (state) => {
      state.filteredProfit = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
        state.totalProfit = calculateTotalProfit(action.payload);
        if (state.selectedDate) {
          const filteredSales = action.payload.filter((sale) => {
            const saleDate = new Date(sale.timestamp);
            return saleDate.toDateString() === new Date(state.selectedDate).toDateString();
          });
          state.filteredProfit = calculateTotalProfit(filteredSales);
        }
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTotalProfit, setFilteredProfit, recordSale, setSelectedDate, resetFilteredProfit } = salesSlice.actions;

export default salesSlice.reducer;





// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { createSelector } from 'reselect';
// import { selectCurrentUser, selectIsAuthenticated } from './authSlice';

// // Async thunk to fetch all sales (only if authenticated)
// export const fetchSales = createAsyncThunk(
//   'sales/fetchSales',
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.get('http://localhost:5000/sales', {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       console.log("Sales fetched successfully:", response.data); // Debugging log
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       console.error("Error fetching sales:", message);  // Debugging log
//       return rejectWithValue(message);
//     }
//   }
// );

// // Helper function to calculate profit for each sale
// const calculateProfitForSale = (sale) => {
//   if (!sale.items || sale.items.length === 0) {
//     console.error("Sale items are missing or empty:", sale);
//     return 0;
//   }

//   return sale.items.reduce((totalProfit, item) => {
//     if (!item.price || !item.product_cost || !item.quantity) {
//       console.error("Item is missing required fields:", item);
//       return totalProfit; // Skip this item
//     }

//     const itemProfit = (item.price - item.product_cost) * item.quantity;
//     return totalProfit + itemProfit;
//   }, 0);
// };

// // Helper function to calculate total profit for a list of sales
// const calculateTotalProfit = (sales) => {
//   return sales.reduce((total, sale) => total + calculateProfitForSale(sale), 0).toFixed(2);
// };

// // Define the initial state
// const initialState = {
//   sales: [],  // Store sales data
//   totalProfit: 0,  // Store total profit
//   filteredProfit: 0,  // Store filtered profit based on selected date
//   error: null,
//   loading: false,
//   selectedDate: null, // To store the date selected for filtering
// };

// // Define the selectors

// // Select all sales
// export const selectSales = (state) => state.sales.sales;

// // Select sales for today
// export const selectSalesForToday = createSelector([selectSales], (sales) => {
//   const today = new Date();
//   const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//   const endOfDay = new Date(today.setHours(23, 59, 59, 999));
//   return sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfDay && saleDate <= endOfDay;
//   });
// });

// // Select sales for this week
// export const selectSalesForThisWeek = createSelector([selectSales], (sales) => {
//   const today = new Date();
//   const dayOfWeek = today.getDay();
//   const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
//   startOfWeek.setHours(0, 0, 0, 0); // Start of week
//   const endOfWeek = new Date(today.setDate(today.getDate() + (6 - dayOfWeek))); // End of week
//   endOfWeek.setHours(23, 59, 59, 999);
//   return sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfWeek && saleDate <= endOfWeek;
//   });
// });

// // Select sales for this month
// export const selectSalesForThisMonth = createSelector([selectSales], (sales) => {
//   const today = new Date();
//   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//   startOfMonth.setHours(0, 0, 0, 0);
//   const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//   endOfMonth.setHours(23, 59, 59, 999);
//   return sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfMonth && saleDate <= endOfMonth;
//   });
// });

// // Select overall profit (for all sales)
// export const selectProfitOverall = createSelector([selectSales], (sales) =>
//   calculateTotalProfit(sales)
// );

// // Select filtered profit based on selected date
// export const selectFilteredProfit = (state) => state.sales.filteredProfit;

// // Select loading and error states
// export const selectSalesLoading = (state) => state.sales.loading;
// export const selectSalesError = (state) => state.sales.error;

// // Create the sales slice
// const salesSlice = createSlice({
//   name: 'sales',
//   initialState,
//   reducers: {
//     // Action to set total profit
//     setTotalProfit: (state, action) => {
//       state.totalProfit = action.payload;
//     },

//     // Action to set filtered profit based on selected date
//     setFilteredProfit: (state, action) => {
//       state.filteredProfit = action.payload;
//     },

//     // Action to record a new sale
//     recordSale: (state, action) => {
//       const newSale = action.payload;
//       state.sales.push(newSale);  // Add the new sale to the sales array

//       // Recalculate total profit after adding the new sale
//       state.totalProfit = calculateTotalProfit(state.sales);
//     },

//     // Action to set the selected date for filtering profits
//     setSelectedDate: (state, action) => {
//       state.selectedDate = action.payload;
//     },

//     // Reset filtered profit
//     resetFilteredProfit: (state) => {
//       state.filteredProfit = 0;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSales.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSales.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales = action.payload; // Populate sales data

//         // Calculate and store the total profit after sales are fetched
//         const totalProfit = calculateTotalProfit(action.payload);
//         state.totalProfit = totalProfit;  // Store the total profit in the state

//         // If there's a selected date, filter profit based on that date
//         if (state.selectedDate) {
//           const filteredSales = action.payload.filter((sale) => {
//             const saleDate = new Date(sale.timestamp);
//             return saleDate.toDateString() === new Date(state.selectedDate).toDateString();
//           });
//           state.filteredProfit = calculateTotalProfit(filteredSales);
//         }
//       })
//       .addCase(fetchSales.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload; // Store the error
//         console.error("Error fetching sales:", action.payload); // Log the error to the console
//       });
//   },
// });

// // Export the actions
// export const { setTotalProfit, setFilteredProfit, recordSale, setSelectedDate, resetFilteredProfit } = salesSlice.actions;

// export default salesSlice.reducer;




// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { createSelector } from 'reselect';
// import { selectCurrentUser, selectIsAuthenticated } from './authSlice';

// // Async thunk to fetch all sales (only if authenticated)
// export const fetchSales = createAsyncThunk(
//   'sales/fetchSales',
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.get('http://localhost:5000/sales', {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       console.log("Sales fetched successfully:", response.data); // Debugging log
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       console.error("Error fetching sales:", message);  // Debugging log
//       return rejectWithValue(message);
//     }
//   }
// );

// // Helper function to calculate profit for each sale
// const calculateProfitForSale = (sale) => {
//   console.log("Calculating profit for sale:", sale); // Debugging log
//   return sale.items.reduce((totalProfit, item) => {
//     const itemProfit = (item.price - item.cost) * item.quantity;  // Ensure 'cost' is defined
//     console.log(`Item profit calculation: price = ${item.price}, cost = ${item.cost}, quantity = ${item.quantity}, itemProfit = ${itemProfit}`);
//     if (isNaN(itemProfit)) {
//       console.error("Profit calculation resulted in NaN for item:", item); // Debugging log
//     }
//     return totalProfit + itemProfit;
//   }, 0);
// };

// // Helper function to calculate total profit for a list of sales
// const calculateTotalProfit = (sales) => {
//   console.log("Calculating total profit for sales:", sales); // Debugging log
//   return sales.reduce((total, sale) => {
//     const saleProfit = calculateProfitForSale(sale);
//     console.log("Total profit after sale:", saleProfit); // Debugging log
//     return total + saleProfit;
//   }, 0).toFixed(2);
// };

// // Define the initial state
// const initialState = {
//   sales: [],  // Store sales data
//   error: null,
//   loading: false,
// };

// // Define the selectors

// // Select all sales
// export const selectSales = (state) => state.sales.sales;

// // Select sales for today
// export const selectSalesForToday = createSelector([selectSales], (sales) => {
//   const today = new Date();
//   const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//   const endOfDay = new Date(today.setHours(23, 59, 59, 999));
//   return sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfDay && saleDate <= endOfDay;
//   });
// });

// // Select sales for this week
// export const selectSalesForThisWeek = createSelector([selectSales], (sales) => {
//   const today = new Date();
//   const dayOfWeek = today.getDay();
//   const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
//   startOfWeek.setHours(0, 0, 0, 0); // Start of week
//   const endOfWeek = new Date(today.setDate(today.getDate() + (6 - dayOfWeek))); // End of week
//   endOfWeek.setHours(23, 59, 59, 999);
//   return sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfWeek && saleDate <= endOfWeek;
//   });
// });

// // Select sales for this month
// export const selectSalesForThisMonth = createSelector([selectSales], (sales) => {
//   const today = new Date();
//   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//   startOfMonth.setHours(0, 0, 0, 0);
//   const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//   endOfMonth.setHours(23, 59, 59, 999);
//   return sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfMonth && saleDate <= endOfMonth;
//   });
// });

// // Select profit for today
// export const selectProfitForToday = createSelector([selectSalesForToday], (sales) =>
//   calculateTotalProfit(sales)
// );

// // Select profit for this week
// export const selectProfitForThisWeek = createSelector([selectSalesForThisWeek], (sales) =>
//   calculateTotalProfit(sales)
// );

// // Select profit for this month
// export const selectProfitForThisMonth = createSelector([selectSalesForThisMonth], (sales) =>
//   calculateTotalProfit(sales)
// );

// // Select overall profit
// export const selectProfitOverall = createSelector([selectSales], (sales) =>
//   calculateTotalProfit(sales)
// );

// // Select loading and error states
// export const selectSalesLoading = (state) => state.sales.loading;
// export const selectSalesError = (state) => state.sales.error;

// // Create the sales slice
// export default createSlice({
//   name: 'sales',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSales.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSales.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales = action.payload; // Populate sales data
//       })
//       .addCase(fetchSales.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload; // Store the error
//         console.error("Error fetching sales:", action.payload); // Log the error to the console
//       });
//   },
// }).reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { createSelector } from 'reselect';
// import { selectCurrentUser, selectIsAuthenticated } from './authSlice';

// // Async thunk to fetch all sales (only if authenticated)
// export const fetchSales = createAsyncThunk(
//   'sales/fetchSales',
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.get('http://localhost:5000/sales', {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       return rejectWithValue(message);
//     }
//   }
// );

// // Helper function to calculate profit for each sale
// const calculateProfitForSale = (sale) => {
//   return sale.items.reduce((totalProfit, item) => {
//     const itemProfit = (item.price - item.cost) * item.quantity; // Use correct fields
//     return totalProfit + itemProfit;
//   }, 0);
// };

// // Helper function to calculate total profit for a list of sales
// const calculateTotalProfit = (sales) => {
//   return sales.reduce((total, sale) => total + calculateProfitForSale(sale), 0).toFixed(2);
// };

// // Define the initial state
// const initialState = {
//   sales: [],  // Store sales data
//   error: null,
//   loading: false,
// };

// // Define the selectors

// // Select all sales
// export const selectSales = (state) => state.sales.sales;

// // Select sales for today
// export const selectSalesForToday = createSelector([selectSales], (sales) => {
//   const today = new Date();
//   const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//   const endOfDay = new Date(today.setHours(23, 59, 59, 999));
//   return sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfDay && saleDate <= endOfDay;
//   });
// });

// // Select sales for this week
// export const selectSalesForThisWeek = createSelector([selectSales], (sales) => {
//   const today = new Date();
//   const dayOfWeek = today.getDay();
//   const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
//   startOfWeek.setHours(0, 0, 0, 0); // Start of week
//   const endOfWeek = new Date(today.setDate(today.getDate() + (6 - dayOfWeek))); // End of week
//   endOfWeek.setHours(23, 59, 59, 999);
//   return sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfWeek && saleDate <= endOfWeek;
//   });
// });

// // Select sales for this month
// export const selectSalesForThisMonth = createSelector([selectSales], (sales) => {
//   const today = new Date();
//   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//   startOfMonth.setHours(0, 0, 0, 0);
//   const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//   endOfMonth.setHours(23, 59, 59, 999);
//   return sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfMonth && saleDate <= endOfMonth;
//   });
// });

// // Select profit for today
// export const selectProfitForToday = createSelector([selectSalesForToday], (sales) =>
//   calculateTotalProfit(sales)
// );

// // Select profit for this week
// export const selectProfitForThisWeek = createSelector([selectSalesForThisWeek], (sales) =>
//   calculateTotalProfit(sales)
// );

// // Select profit for this month
// export const selectProfitForThisMonth = createSelector([selectSalesForThisMonth], (sales) =>
//   calculateTotalProfit(sales)
// );

// // Select overall profit
// export const selectProfitOverall = createSelector([selectSales], (sales) =>
//   calculateTotalProfit(sales)
// );

// // Select loading and error states
// export const selectSalesLoading = (state) => state.sales.loading;
// export const selectSalesError = (state) => state.sales.error;

// // Create the sales slice
// export default createSlice({
//   name: 'sales',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSales.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSales.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales = action.payload; // Populate sales data
//       })
//       .addCase(fetchSales.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload; // Store the error
//       });
//   },
// }).reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { createSelector } from 'reselect';
// import { selectCurrentUser, selectIsAuthenticated } from './authSlice';

// // Async thunk to fetch all sales (only if authenticated)
// export const fetchSales = createAsyncThunk(
//   'sales/fetchSales',
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.get('http://localhost:5000/sales', {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       return rejectWithValue(message);
//     }
//   }
// );

// // Async thunk to record a sale (new sale)
// export const recordSale = createAsyncThunk(
//   'sales/recordSale',
//   async (saleData, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/sales', saleData, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       return response.data;  // Returning sale data after successful recording
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       return rejectWithValue(message);
//     }
//   }
// );

// const initialState = {
//   sales: [],  // Store sales data
//   error: null,
//   loading: false,
// };

// // Define selectSales first (before using it in createSelector)
// export const selectSales = (state) => state.sales.sales;

// // Helper function to calculate profit for each product within a sale
// const calculateProfitForSale = (sale) => {
//   return sale.items.reduce((totalProfit, item) => {
//     const itemProfit = (item.price - item.cost) * item.cartQuantity;
//     return totalProfit + itemProfit;
//   }, 0);
// };

// // Helper function to calculate total profit for any filtered list of sales
// const calculateTotalProfit = (sales) => {
//   return sales.reduce((total, sale) => total + calculateProfitForSale(sale), 0).toFixed(2);
// };

// // Create a selector for today's sales
// export const selectSalesForToday = createSelector(
//   [selectSales],
//   (sales) => {
//     const today = new Date();
//     const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(today.setHours(23, 59, 59, 999));
//     return sales.filter((sale) => {
//       const saleDate = new Date(sale.timestamp);
//       return saleDate >= startOfDay && saleDate <= endOfDay;
//     });
//   }
// );

// // Create a selector for this week's sales
// export const selectSalesForThisWeek = createSelector(
//   [selectSales],
//   (sales) => {
//     const today = new Date();
//     const dayOfWeek = today.getDay();
//     const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
//     startOfWeek.setHours(0, 0, 0, 0);  // Start of the week (Sunday)
//     const endOfWeek = new Date(today.setDate(today.getDate() + (6 - dayOfWeek)));  // End of the week (Saturday)
//     endOfWeek.setHours(23, 59, 59, 999); // End of the week
//     return sales.filter((sale) => {
//       const saleDate = new Date(sale.timestamp);
//       return saleDate >= startOfWeek && saleDate <= endOfWeek;
//     });
//   }
// );

// // Create a selector for this month's sales
// export const selectSalesForThisMonth = createSelector(
//   [selectSales],
//   (sales) => {
//     const today = new Date();
//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     startOfMonth.setHours(0, 0, 0, 0);
//     const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//     endOfMonth.setHours(23, 59, 59, 999);
//     return sales.filter((sale) => {
//       const saleDate = new Date(sale.timestamp);
//       return saleDate >= startOfMonth && saleDate <= endOfMonth;
//     });
//   }
// );

// // Selectors for the profit
// export const selectProfitForToday = createSelector(
//   [selectSalesForToday],
//   (sales) => calculateTotalProfit(sales)
// );

// export const selectProfitForThisWeek = createSelector(
//   [selectSalesForThisWeek],
//   (sales) => calculateTotalProfit(sales)
// );

// export const selectProfitForThisMonth = createSelector(
//   [selectSalesForThisMonth],
//   (sales) => calculateTotalProfit(sales)
// );

// export const selectProfitOverall = createSelector(
//   [selectSales],
//   (sales) => calculateTotalProfit(sales)
// );

// // Loading and error selectors
// export const selectSalesLoading = (state) => state.sales.loading;
// export const selectSalesError = (state) => state.sales.error;

// export default createSlice({
//   name: 'sales',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSales.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSales.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales = action.payload;  // Populate sales with fetched data
//       })
//       .addCase(fetchSales.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;  // Handle errors
//       })
//       .addCase(recordSale.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(recordSale.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales.push(action.payload);  // Add the new sale to the sales array
//       })
//       .addCase(recordSale.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;  // Handle errors
//       });
//   },
// }).reducer;



// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { createSelector } from 'reselect';
// import { selectCurrentUser, selectIsAuthenticated } from './authSlice';

// // Async thunk to fetch all sales (only if authenticated)
// export const fetchSales = createAsyncThunk(
//   'sales/fetchSales',
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.get('http://localhost:5000/sales', {
//         headers: { Authorization: `Bearer KshKsh{user.token}` },
//       });
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       return rejectWithValue(message);
//     }
//   }
// );

// // Async thunk to record a sale (new sale)
// export const recordSale = createAsyncThunk(
//   'sales/recordSale',
//   async (saleData, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/sales', saleData, {
//         headers: { Authorization: `Bearer KshKsh{user.token}` },
//       });
//       return response.data;  // Returning sale data after successful recording
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       return rejectWithValue(message);
//     }
//   }
// );

// const initialState = {
//   sales: [],  // Store sales data
//   error: null,
//   loading: false,
// };

// // Define selectSales first (before using it in createSelector)
// export const selectSales = (state) => state.sales.sales;

// // Create a selector for today's sales
// export const selectSalesForToday = createSelector(
//   [selectSales],  // Input selector
//   (sales) => {
//     const today = new Date();
//     const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(today.setHours(23, 59, 59, 999));
//     return sales.filter((sale) => {
//       const saleDate = new Date(sale.timestamp);
//       return saleDate >= startOfDay && saleDate <= endOfDay;
//     });
//   }
// );

// // Create a selector for this week's sales
// export const selectSalesForThisWeek = createSelector(
//   [selectSales],
//   (sales) => {
//     const today = new Date();
//     const dayOfWeek = today.getDay();
//     const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
//     startOfWeek.setHours(0, 0, 0, 0);  // Start of the week (Sunday)
//     const endOfWeek = new Date(today.setDate(today.getDate() + (6 - dayOfWeek)));  // End of the week (Saturday)
//     endOfWeek.setHours(23, 59, 59, 999); // End of the week
//     return sales.filter((sale) => {
//       const saleDate = new Date(sale.timestamp);
//       return saleDate >= startOfWeek && saleDate <= endOfWeek;
//     });
//   }
// );

// // Create a selector for this month's sales
// export const selectSalesForThisMonth = createSelector(
//   [selectSales],
//   (sales) => {
//     const today = new Date();
//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     startOfMonth.setHours(0, 0, 0, 0);
//     const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//     endOfMonth.setHours(23, 59, 59, 999);
//     return sales.filter((sale) => {
//       const saleDate = new Date(sale.timestamp);
//       return saleDate >= startOfMonth && saleDate <= endOfMonth;
//     });
//   }
// );

// // Helper function to calculate total sales for any filtered list of sales
// export const calculateTotalSales = (sales) => {
//   return sales.reduce((total, sale) => total + (sale.total || 0), 0).toFixed(2);
// };

// // Helper function to calculate total profit for any filtered list of sales
// export const calculateTotalProfit = (sales) => {
//   return sales.reduce((total, sale) => total + (sale.profit || 0), 0).toFixed(2);
// };

// // Selectors for the profit
// export const selectProfitForToday = createSelector(
//   [selectSalesForToday],
//   (sales) => calculateTotalProfit(sales)
// );

// export const selectProfitForThisWeek = createSelector(
//   [selectSalesForThisWeek],
//   (sales) => calculateTotalProfit(sales)
// );

// export const selectProfitForThisMonth = createSelector(
//   [selectSalesForThisMonth],
//   (sales) => calculateTotalProfit(sales)
// );

// export const selectProfitOverall = createSelector(
//   [selectSales],
//   (sales) => calculateTotalProfit(sales)
// );

// export const selectSalesLoading = (state) => state.sales.loading;
// export const selectSalesError = (state) => state.sales.error;

// export default createSlice({
//   name: 'sales',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSales.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSales.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales = action.payload;  // Populate sales with fetched data
//       })
//       .addCase(fetchSales.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;  // Handle errors
//       })
//       .addCase(recordSale.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(recordSale.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales.push(action.payload);  // Add the new sale to the sales array
//       })
//       .addCase(recordSale.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;  // Handle errors
//       });
//   },
// }).reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { createSelector } from 'reselect';  // Import createSelector from reselect
// import { selectCurrentUser, selectIsAuthenticated } from './authSlice';

// // Async thunk to fetch all sales (only if authenticated)
// export const fetchSales = createAsyncThunk(
//   'sales/fetchSales',
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.get('http://localhost:5000/sales', {
//         headers: { Authorization: `Bearer KshKsh{user.token}` },
//       });
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       return rejectWithValue(message);
//     }
//   }
// );

// // Async thunk to record a sale (new sale)
// export const recordSale = createAsyncThunk(
//   'sales/recordSale',
//   async (saleData, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/sales', saleData, {
//         headers: { Authorization: `Bearer KshKsh{user.token}` },
//       });
//       return response.data;  // Returning sale data after successful recording
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       return rejectWithValue(message);
//     }
//   }
// );

// const initialState = {
//   sales: [],  // Store sales data
//   error: null,
//   loading: false,
// };

// // Define selectSales first (before using it in createSelector)
// export const selectSales = (state) => state.sales.sales;

// // Create a selector for today's sales
// export const selectSalesForToday = createSelector(
//   [selectSales],  // Input selector
//   (sales) => {
//     const today = new Date();
//     const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(today.setHours(23, 59, 59, 999));
//     return sales.filter((sale) => {
//       const saleDate = new Date(sale.timestamp);
//       return saleDate >= startOfDay && saleDate <= endOfDay;
//     });
//   }
// );

// // Create a selector for this week's sales
// export const selectSalesForThisWeek = createSelector(
//   [selectSales],
//   (sales) => {
//     const today = new Date();
//     const dayOfWeek = today.getDay();
//     const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
//     startOfWeek.setHours(0, 0, 0, 0);  // Start of the week (Sunday)
//     const endOfWeek = new Date(today.setDate(today.getDate() + (6 - dayOfWeek)));  // End of the week (Saturday)
//     endOfWeek.setHours(23, 59, 59, 999); // End of the week
//     return sales.filter((sale) => {
//       const saleDate = new Date(sale.timestamp);
//       return saleDate >= startOfWeek && saleDate <= endOfWeek;
//     });
//   }
// );

// // Create a selector for this month's sales
// export const selectSalesForThisMonth = createSelector(
//   [selectSales],
//   (sales) => {
//     const today = new Date();
//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     startOfMonth.setHours(0, 0, 0, 0);
//     const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//     endOfMonth.setHours(23, 59, 59, 999);
//     return sales.filter((sale) => {
//       const saleDate = new Date(sale.timestamp);
//       return saleDate >= startOfMonth && saleDate <= endOfMonth;
//     });
//   }
// );

// // Helper function to calculate total sales for any filtered list of sales
// export const calculateTotalSales = (sales) => {
//   return sales.reduce((total, sale) => total + (sale.total || 0), 0).toFixed(2);
// };

// export const selectSalesLoading = (state) => state.sales.loading;
// export const selectSalesError = (state) => state.sales.error;

// export default createSlice({
//   name: 'sales',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSales.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSales.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales = action.payload;  // Populate sales with fetched data
//       })
//       .addCase(fetchSales.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;  // Handle errors
//       })
//       .addCase(recordSale.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(recordSale.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales.push(action.payload);  // Add the new sale to the sales array
//       })
//       .addCase(recordSale.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;  // Handle errors
//       });
//   },
// }).reducer;



// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { selectCurrentUser, selectIsAuthenticated } from './authSlice';

// // Async thunk to fetch all sales (only if authenticated)
// export const fetchSales = createAsyncThunk(
//   'sales/fetchSales',
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.get('http://localhost:5000/sales', {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       return response.data;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       return rejectWithValue(message);
//     }
//   }
// );

// // Async thunk to record a sale (new sale)
// export const recordSale = createAsyncThunk(
//   'sales/recordSale',
//   async (saleData, { getState, rejectWithValue }) => {
//     const state = getState();
//     const user = selectCurrentUser(state);  // Get current user from auth slice
//     const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

//     if (!isAuthenticated || !user) {
//       return rejectWithValue('No session found, please log in first.');
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/sales', saleData, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       return response.data;  // Returning sale data after successful recording
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'An error occurred';
//       return rejectWithValue(message);
//     }
//   }
// );

// const initialState = {
//   sales: [],  // Store sales data
//   error: null,
//   loading: false,
// };

// const salesSlice = createSlice({
//   name: 'sales',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSales.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSales.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales = action.payload;  // Populate sales with fetched data
//       })
//       .addCase(fetchSales.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;  // Handle errors
//       })
//       .addCase(recordSale.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(recordSale.fulfilled, (state, action) => {
//         state.loading = false;
//         state.sales.push(action.payload);  // Add the new sale to the sales array
//       })
//       .addCase(recordSale.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;  // Handle errors
//       });
//   },
// });

// // Selectors for accessing sales data
// export const selectSales = (state) => state.sales.sales;
// export const selectSalesLoading = (state) => state.sales.loading;
// export const selectSalesError = (state) => state.sales.error;

// // Selectors to filter sales by time periods (today, week, month)
// export const selectSalesForToday = (state) => {
//   const today = new Date();
//   const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//   const endOfDay = new Date(today.setHours(23, 59, 59, 999));
//   return state.sales.sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfDay && saleDate <= endOfDay;
//   });
// };

// export const selectSalesForThisWeek = (state) => {
//   const today = new Date();
//   const dayOfWeek = today.getDay();
//   const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
//   startOfWeek.setHours(0, 0, 0, 0);  // Start of the week (Sunday)
//   return state.sales.sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfWeek;
//   });
// };

// export const selectSalesForThisMonth = (state) => {
//   const today = new Date();
//   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//   startOfMonth.setHours(0, 0, 0, 0);
//   return state.sales.sales.filter((sale) => {
//     const saleDate = new Date(sale.timestamp);
//     return saleDate >= startOfMonth;
//   });
// };

// // Helper function to calculate total sales for any filtered list of sales
// export const calculateTotalSales = (sales) => {
//   return sales.reduce((total, sale) => total + (sale.total || 0), 0).toFixed(2);
// };

// export default salesSlice.reducer;
