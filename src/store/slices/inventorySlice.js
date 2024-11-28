import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],  // Stores the list of products
  loading: false,  // For loading state
  error: null,  // For handling errors
};

// Fetch all products from the backend
export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      return response.data;  // Return product data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

// Create a new product (admin only)
export const createProduct = createAsyncThunk(
  'inventory/createProduct',
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/products', product);
      return response.data;  // Return newly created product
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add product');
    }
  }
);

// Update product details (e.g., stock quantity) by product ID
export const updateProductById = createAsyncThunk(
  'inventory/updateProductById',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/products/Ksh{id}`, data);
      return response.data;  // Return updated product
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update product');
    }
  }
);

// Delete product by ID (admin only)
export const deleteProductById = createAsyncThunk(
  'inventory/deleteProductById',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/products/Ksh{id}`);
      return id;  // Return the product ID to remove it from the Redux store
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete product');
    }
  }
);

// New thunk to update inventory stock after a sale
export const updateInventoryStock = createAsyncThunk(
  'inventory/updateInventoryStock',
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/products/Ksh{product.id}`, {
        quantity: product.quantity,  // Update quantity after sale
        barcode: product.barcode,
        category: product.category,
        icon: product.icon,
        name: product.name,
        price: product.price,
        reorder_point: product.reorder_point,
        sku: product.sku,
      });
      return response.data;  // Return updated product data after stock update
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update inventory stock');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    // Action to remove a product from the inventory
    removeProductFromInventory: (state, action) => {
      state.products = state.products.filter(product => product.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch products lifecycle
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle create product lifecycle
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.loading = false;
      })
      
      // Handle update product lifecycle
      .addCase(updateProductById.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;  // Update the product
        }
        state.loading = false;
      })
      
      // Handle delete product lifecycle
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
        state.loading = false;
      })
      
      // Handle stock update after sale lifecycle
      .addCase(updateInventoryStock.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index].quantity = action.payload.quantity;  // Update stock in Redux store
        }
        state.loading = false;
      });
  },
});

export const { setLoading, setError, removeProductFromInventory } = inventorySlice.actions;

export default inventorySlice.reducer;
