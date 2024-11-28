// User definition
export const User = {
    id: '', // Unique identifier for the user
    name: '', // Full name of the user
    email: '', // Email address of the user
    role: 'admin', // Role of the user ('admin', 'manager', or 'cashier')
  };
  
  // Product definition
  export const Product = {
    id: '', // Unique identifier for the product
    name: '', // Name of the product
    sku: '', // Stock Keeping Unit (SKU) code
    category: '', // Category to which the product belongs
    price: 0, // Price of the product
    quantity: 0, // Quantity in stock
    reorderPoint: 0, // Minimum quantity before restocking is needed
    barcode: '', // (Optional) Barcode of the product
    image: '', // (Optional) Image URL for the product
  };
  
  // Cart item definition (extends Product with cart-specific properties)
  export const CartItem = {
    ...Product,
    cartQuantity: 0, // Quantity of the product in the cart
  };
  
  // Sale definition
  export const Sale = {
    id: '', // Unique identifier for the sale
    items: [], // Array of CartItem objects in the sale
    total: 0, // Total amount of the sale
    paymentMethod: '', // Payment method used (e.g., 'cash', 'card')
    cashierId: '', // ID of the cashier handling the sale
    timestamp: '', // Timestamp of the sale
  };
  