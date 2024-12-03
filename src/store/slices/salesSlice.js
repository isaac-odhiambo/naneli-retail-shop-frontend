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
        headers: { Authorization: `Bearer KshKsh{user.token}` },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to record a sale (new sale)
export const recordSale = createAsyncThunk(
  'sales/recordSale',
  async (saleData, { getState, rejectWithValue }) => {
    const state = getState();
    const user = selectCurrentUser(state);  // Get current user from auth slice
    const isAuthenticated = selectIsAuthenticated(state);  // Check if the user is authenticated

    if (!isAuthenticated || !user) {
      return rejectWithValue('No session found, please log in first.');
    }

    try {
      const response = await axios.post('http://localhost:5000/sales', saleData, {
        headers: { Authorization: `Bearer KshKsh{user.token}` },
      });
      return response.data;  // Returning sale data after successful recording
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  sales: [],  // Store sales data
  error: null,
  loading: false,
};

// Define selectSales first (before using it in createSelector)
export const selectSales = (state) => state.sales.sales;

// Create a selector for today's sales
export const selectSalesForToday = createSelector(
  [selectSales],  // Input selector
  (sales) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    return sales.filter((sale) => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= startOfDay && saleDate <= endOfDay;
    });
  }
);

// Create a selector for this week's sales
export const selectSalesForThisWeek = createSelector(
  [selectSales],
  (sales) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
    startOfWeek.setHours(0, 0, 0, 0);  // Start of the week (Sunday)
    const endOfWeek = new Date(today.setDate(today.getDate() + (6 - dayOfWeek)));  // End of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999); // End of the week
    return sales.filter((sale) => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= startOfWeek && saleDate <= endOfWeek;
    });
  }
);

// Create a selector for this month's sales
export const selectSalesForThisMonth = createSelector(
  [selectSales],
  (sales) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    return sales.filter((sale) => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= startOfMonth && saleDate <= endOfMonth;
    });
  }
);

// Helper function to calculate total sales for any filtered list of sales
export const calculateTotalSales = (sales) => {
  return sales.reduce((total, sale) => total + (sale.total || 0), 0).toFixed(2);
};

// Helper function to calculate total profit for any filtered list of sales
export const calculateTotalProfit = (sales) => {
  return sales.reduce((total, sale) => total + (sale.profit || 0), 0).toFixed(2);
};

// Selectors for the profit
export const selectProfitForToday = createSelector(
  [selectSalesForToday],
  (sales) => calculateTotalProfit(sales)
);

export const selectProfitForThisWeek = createSelector(
  [selectSalesForThisWeek],
  (sales) => calculateTotalProfit(sales)
);

export const selectProfitForThisMonth = createSelector(
  [selectSalesForThisMonth],
  (sales) => calculateTotalProfit(sales)
);

export const selectProfitOverall = createSelector(
  [selectSales],
  (sales) => calculateTotalProfit(sales)
);

export const selectSalesLoading = (state) => state.sales.loading;
export const selectSalesError = (state) => state.sales.error;

export default createSlice({
  name: 'sales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;  // Populate sales with fetched data
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Handle errors
      })
      .addCase(recordSale.pending, (state) => {
        state.loading = true;
      })
      .addCase(recordSale.fulfilled, (state, action) => {
        state.loading = false;
        state.sales.push(action.payload);  // Add the new sale to the sales array
      })
      .addCase(recordSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Handle errors
      });
  },
}).reducer;


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
