import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for inventory
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
      const response = await axios.get('https://naneli-backend.onrender.com/products');
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
      const response = await axios.post('https://naneli-backend.onrender.com/products', {
        ...product,
        icon: product.icon || null,  // Make icon optional
      });
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
    // Ensure numeric fields are numbers before sending
    const updatedData = {
      ...data,
      cost: Number(data.cost),
      price: Number(data.price),
      quantity: Number(data.quantity),
      reorder_point: Number(data.reorder_point),  // Convert to number
      icon: data.icon || null,  // Ensure icon is optional
    };

    try {
      const response = await axios.put(`https://naneli-backend.onrender.com/products/${id}`, updatedData);
      return response.data;  // Return updated product
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to update product');
    }
  }
);

// Delete product by ID (admin only)
export const deleteProductById = createAsyncThunk(
  'inventory/deleteProductById',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`https://naneli-backend.onrender.com/products/${id}`);
      return id;  // Return the product ID to remove it from the Redux store
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete product');
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
      state.products = state.products.filter((product) => product.id !== action.payload);
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
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle create product lifecycle
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors on new action
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);  // Add the new product to the list
        state.loading = false;
        state.error = null; // Clear error on success
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error on failed creation
      })

      // Handle update product lifecycle
      .addCase(updateProductById.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear errors on action start
      })
      .addCase(updateProductById.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;  // Update the product
        }
        state.loading = false;
        state.error = null; // Clear error on success
      })
      .addCase(updateProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error on failed update
      })

      // Handle delete product lifecycle
      .addCase(deleteProductById.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear errors on action start
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);  // Remove product by ID
        state.loading = false;
        state.error = null; // Clear error on success
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error on failed delete
      });
  },
});

export const { setLoading, setError, removeProductFromInventory } = inventorySlice.actions;

export default inventorySlice.reducer;

