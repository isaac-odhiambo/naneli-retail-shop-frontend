import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSelector } from 'reselect';
import { selectCurrentUser, selectIsAuthenticated } from './authSlice';

// Async thunk for fetching all sales (only if authenticated)
export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const user = selectCurrentUser(state);
    const isAuthenticated = selectIsAuthenticated(state);

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

// Async thunk for recording a sale
export const recordSale = createAsyncThunk(
  'sales/recordSale',
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/sales', saleData);
      return response.data; // Sale was successful, return the data from the response
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error during sale';
      return rejectWithValue(message); // Reject with a custom error message
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
export const selectSelectedDate = (state) => state.sales.selectedDate;

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    sales: [],
    totalProfit: 0,
    filteredProfit: 0,
    error: null,
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
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    resetFilteredProfit: (state) => {
      state.filteredProfit = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sales Cases
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
      })

      // Record Sale Cases
      .addCase(recordSale.pending, (state) => {
        state.loading = true;
      })
      .addCase(recordSale.fulfilled, (state, action) => {
        state.loading = false;
        state.sales.push(action.payload);  // Add new sale to the list
        state.totalProfit = calculateTotalProfit(state.sales);  // Update total profit
      })
      .addCase(recordSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to record sale';
      });
  },
});

export const { setTotalProfit, setFilteredProfit, setSelectedDate, resetFilteredProfit } = salesSlice.actions;

export default salesSlice.reducer;

