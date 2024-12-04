import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Check localStorage for user and role persistence on page reload
  user: JSON.parse(localStorage.getItem('user')) || null, // Retrieve user object from localStorage if available
  isAuthenticated: !!localStorage.getItem('user'), // Check if a user is logged in (based on the presence of 'user' in localStorage)
  role: JSON.parse(localStorage.getItem('user'))?.role || null, // Get the role from localStorage if it exists
  allUsers: [], // For tracking all users (admin functionality)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login action to authenticate and store user info in Redux and localStorage
    login(state, action) {
      const { user } = action.payload;
      state.user = { 
        ...user, 
        loginTime: new Date().toISOString(),
        logoutTime: null, 
      };
      state.isAuthenticated = true;
      state.role = user.role;
      
      // Persist user data and role in localStorage
      localStorage.setItem('user', JSON.stringify(user));
    },

    // Logout action to clear user data from Redux and localStorage
    logout(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      
      // Remove user data and role from localStorage
      localStorage.removeItem('user');
    },

    // Set the current user from external data (useful for admin or other actions)
    setUser(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.user.role;
    },

    // Add a new user to the allUsers array
    addUser(state, action) {
      state.allUsers.push(action.payload);
    },

    // Edit an existing user by their id
    editUser(state, action) {
      const { id, updatedUser } = action.payload;
      const userIndex = state.allUsers.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        state.allUsers[userIndex] = { ...state.allUsers[userIndex], ...updatedUser };
      }
    },

    // Delete a user by their id
    deleteUser(state, action) {
      const { id } = action.payload;
      state.allUsers = state.allUsers.filter(user => user.id !== id);
    },

    // Set the entire list of users (useful for admin management)
    setUsers(state, action) {
      state.allUsers = action.payload;
    },
  },
});

// Export the actions from the slice
export const { login, logout, setUser, addUser, editUser, deleteUser, setUsers } = authSlice.actions;

// Selectors for the state
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentRole = (state) => state.auth.role; // Selector for role
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAllUsers = (state) => state.auth.allUsers;

export default authSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: JSON.parse(localStorage.getItem('user')) || null, // Get user from localStorage if available
//   isAuthenticated: !!localStorage.getItem('user'), // Check if user exists in localStorage
//   role: null, // We'll get this from the user data
//   allUsers: [], // For tracking all users (admin functionality)
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login(state, action) {
//       const { user } = action.payload;
//       state.user = { 
//         ...user, 
//         loginTime: new Date().toISOString(),
//         logoutTime: null, 
//       };
//       state.isAuthenticated = true;
//       state.role = user.role;
      
//       // Store user data in localStorage for persistence
//       localStorage.setItem('user', JSON.stringify(user));
//     },

//     logout(state) {
//       state.user = null;
//       state.role = null;
//       state.isAuthenticated = false;
      
//       // Remove user data from localStorage
//       localStorage.removeItem('user');
//     },

//     setUser(state, action) {
//       state.user = action.payload.user;
//       state.role = action.payload.user.role;
//     },

//     addUser(state, action) {
//       state.allUsers.push(action.payload);
//     },

//     editUser(state, action) {
//       const { id, updatedUser } = action.payload;
//       const userIndex = state.allUsers.findIndex(user => user.id === id);
//       if (userIndex !== -1) {
//         state.allUsers[userIndex] = { ...state.allUsers[userIndex], ...updatedUser };
//       }
//     },

//     deleteUser(state, action) {
//       const { id } = action.payload;
//       state.allUsers = state.allUsers.filter(user => user.id !== id);
//     },

//     setUsers(state, action) {
//       state.allUsers = action.payload;
//     },
//   },
// });

// // Export the actions from the slice
// export const { login, logout, setUser, addUser, editUser, deleteUser, setUsers } = authSlice.actions;

// // Selectors for the state
// export const selectCurrentUser = (state) => state.auth.user;
// export const selectCurrentRole = (state) => state.auth.role; // Selector for role
// export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
// export const selectAllUsers = (state) => state.auth.allUsers;

// export default authSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: JSON.parse(localStorage.getItem('user')) || null, // Get user from localStorage if available
//   isAuthenticated: !!localStorage.getItem('authToken'), // Check if token exists in localStorage
//   token: localStorage.getItem('authToken') || null, // Get token from localStorage
//   role: null, 
//   allUsers: [], // For tracking all users (admin functionality)
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login(state, action) {
//       const { user, token } = action.payload;
//       state.user = { 
//         ...user, 
//         loginTime: new Date().toISOString(), 
//         logoutTime: null, 
//       };
//       state.token = token;
//       state.isAuthenticated = true;
//       state.role = user.role;
      
//       // Store user and token in localStorage for persistence
//       localStorage.setItem('user', JSON.stringify(user));
//       localStorage.setItem('authToken', token);
//     },

//     logout(state) {
//       state.user = null;
//       state.token = null;
//       state.role = null;
//       state.isAuthenticated = false;
      
//       // Remove user and token from localStorage
//       localStorage.removeItem('user');
//       localStorage.removeItem('authToken');
//     },

//     setUser(state, action) {
//       state.user = action.payload.user;
//       state.role = action.payload.user.role;
//     },

//     addUser(state, action) {
//       state.allUsers.push(action.payload);
//     },

//     editUser(state, action) {
//       const { id, updatedUser } = action.payload;
//       const userIndex = state.allUsers.findIndex(user => user.id === id);
//       if (userIndex !== -1) {
//         state.allUsers[userIndex] = { ...state.allUsers[userIndex], ...updatedUser };
//       }
//     },

//     deleteUser(state, action) {
//       const { id } = action.payload;
//       state.allUsers = state.allUsers.filter(user => user.id !== id);
//     },

//     setUsers(state, action) {
//       state.allUsers = action.payload;
//     },
//   },
// });

// // Export the actions from the slice
// export const { login, logout, setUser, addUser, editUser, deleteUser, setUsers } = authSlice.actions;

// // Selectors for the state
// export const selectCurrentUser = (state) => state.auth.user;
// export const selectCurrentRole = (state) => state.auth.role; // Selector for role
// export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
// export const selectToken = (state) => state.auth.token;
// export const selectAllUsers = (state) => state.auth.allUsers;

// export default authSlice.reducer;



// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: null, // User details: { id, username, email, role }
//   isAuthenticated: false,
//   token: null, // JWT token
//   role: null, // User's role: 'admin', 'cashier', or 'manager'
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login(state, action) {
//       // Extract user details and token from payload
//       state.user = action.payload.user; // { id, username, email, role }
//       state.token = action.payload.token; // JWT token
//       state.role = action.payload.user.role; // Store the user's role
//       state.isAuthenticated = true;
//     },
//     logout(state) {
//       // Clear user data, token, role, and authentication status
//       state.user = null;
//       state.token = null;
//       state.role = null;
//       state.isAuthenticated = false;
//     },
//     setUser(state, action) {
//       // Update user details and role in the state
//       state.user = action.payload.user;
//       state.role = action.payload.user.role;
//     },
//   },
// });

// export const { login, logout, setUser } = authSlice.actions;

// // Selectors
// export const selectCurrentUser = (state) => state.auth.user; // Get user details
// export const selectCurrentRole = (state) => state.auth.role; // Get user role
// export const selectIsAuthenticated = (state) => state.auth.isAuthenticated; // Authentication status
// export const selectToken = (state) => state.auth.token; // JWT token

// export default authSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: null, // User details: { id, username, email, role, loginTime, logoutTime }
//   isAuthenticated: false,
//   token: null, // JWT token
//   role: null, // User's role: 'admin', 'cashier', or 'manager'
//   allUsers: [], // For tracking all users (admin functionality)
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login(state, action) {
//       // Extract user details and token from payload
//       const { user, token } = action.payload;
//       state.user = { 
//         ...user, 
//         loginTime: new Date().toISOString(), // Track login time
//         logoutTime: null, // Initially, logout time is null
//       };
//       state.token = token; // JWT token
//       state.role = user.role; // Store the user's role
//       state.isAuthenticated = true;
//     },

//     logout(state) {
//       // Clear user data, token, role, and authentication status
//       if (state.user) {
//         state.user.logoutTime = new Date().toISOString(); // Set logout time
//       }
//       state.user = null;
//       state.token = null;
//       state.role = null;
//       state.isAuthenticated = false;
//     },

//     setUser(state, action) {
//       // Update user details and role in the state
//       state.user = action.payload.user;
//       state.role = action.payload.user.role;
//     },

//     // Admin actions for managing users
//     addUser(state, action) {
//       state.allUsers.push(action.payload); // Add a new user
//     },
//     editUser(state, action) {
//       const { id, updatedUser } = action.payload;
//       const userIndex = state.allUsers.findIndex(user => user.id === id);
//       if (userIndex !== -1) {
//         state.allUsers[userIndex] = { ...state.allUsers[userIndex], ...updatedUser };
//       }
//     },
//     deleteUser(state, action) {
//       const { id } = action.payload;
//       state.allUsers = state.allUsers.filter(user => user.id !== id);
//     },
//     setUsers(state, action) {
//       state.allUsers = action.payload; // Set all users (for loading or fetching users)
//     },
//   },
// });

// export const { 
//   login, 
//   logout, 
//   setUser, 
//   addUser, 
//   editUser, 
//   deleteUser, 
//   setUsers 
// } = authSlice.actions;

// // Selectors
// export const selectCurrentUser = (state) => state.auth.user; // Get user details
// export const selectCurrentRole = (state) => state.auth.role; // Get user role
// export const selectIsAuthenticated = (state) => state.auth.isAuthenticated; // Authentication status
// export const selectToken = (state) => state.auth.token; // JWT token
// export const selectAllUsers = (state) => state.auth.allUsers; // Get all users (for admins)

// // Utility selectors for admin views (like users list with login/logout times)
// export const selectUsersForAdmin = (state) => {
//   return state.auth.allUsers.map(user => ({
//     id: user.id,
//     username: user.username,
//     email: user.email,
//     role: user.role,
//     loginTime: user.loginTime,
//     logoutTime: user.logoutTime,
//   }));
// };

// export default authSlice.reducer;
