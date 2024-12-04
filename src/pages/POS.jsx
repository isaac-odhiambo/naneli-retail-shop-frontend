/** @jsxImportSource react */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Import icons from react-icons
import { FaApple, FaBeer, FaCarrot, FaCoffee, FaLaptop, FaPhone } from 'react-icons/fa';

// Redux actions
import { fetchProducts, updateInventoryStock, removeProductFromInventory } from "../store/slices/inventorySlice";
import { addToCart, removeFromCart, updateQuantity, clearCart } from "../store/slices/cartSlice";
import { recordSale, setTotalProfit, setFilteredProfit } from "../store/slices/salesSlice"; // Ensure we import the necessary actions

export default function POS() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [transactionComplete, setTransactionComplete] = useState(false); // State to control success message display
  const cart = useSelector((state) => state.cart);
  const inventory = useSelector((state) => state.inventory.products);
  const currentUser = useSelector((state) => state.auth.user); // Assuming user info is stored in authSlice
  const dispatch = useDispatch();

  // Fetch products when the component mounts
  useEffect(() => {
    dispatch(fetchProducts())
      .unwrap()
      .catch((error) => {
        toast.error(`Error fetching products: ${error.message || "Unknown error"}`);
      });
  }, [dispatch]);

  // Log Redux state changes (loading, error, products)
  const { loading, error, products } = useSelector((state) => state.inventory);

  // Handle adding a product to the cart
  const handleAddToCart = (product) => {
    const cartItem = cart.items.find((item) => item.id === product.id);
    if (cartItem && cartItem.cartQuantity >= product.quantity) {
      toast.error("Not enough stock available");
      return;
    }
    if (product.quantity === 0) {
      toast.error("Product out of stock");
      return;
    }
    dispatch(addToCart(product));
  };

  // Handle quantity change in the cart
  const handleQuantityChange = (id, newQuantity) => {
    const product = inventory.find((p) => p.id === id);
    if (product) {
      const maxQuantity = product.quantity;
      if (newQuantity <= maxQuantity && newQuantity >= 1) {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
      } else {
        toast.error("Not enough stock available");
      }
    }
  };

  // Function to calculate profit (without displaying cost to the user)
  const calculateProfit = () => {
    let totalProfit = 0;
    cart.items.forEach((item) => {
      const product = inventory.find((p) => p.id === item.id);
      if (product) {
        const costPrice = product.costPrice; // Assume costPrice is part of the product data
        const salePrice = item.price;
        const profit = (salePrice - costPrice) * item.cartQuantity;
        totalProfit += profit;
      }
    });
    return totalProfit;
  };

  // Handle the checkout process
  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // Prepare sale data according to the API's expected format
    const saleData = {
      cashier_id: currentUser ? currentUser.id : 1,  // Use the logged-in cashier's ID or default to 1
      items: cart.items.map((item) => ({
        id: item.id,  // Use the item ID from cart
        price: item.price,
        product_id: item.id,  // Use the product ID from cart
        product_name: item.name,  // Use the product name from the cart
        quantity: item.cartQuantity,  // Ensure the cart quantity is used
        sale_id: 1,  // Use the same sale_id for all items in the sale (if needed, generate this dynamically)
      })),
      payment_method: paymentMethod,
      timestamp: new Date().toISOString(),
      total: cart.total,
    };

    try {
      // First, record the sale in the backend
      const sale = await dispatch(recordSale(saleData)).unwrap(); // Record the sale

      // Calculate profit from the cart items
      const totalProfit = calculateProfit();
      // Dispatch the profit to the Redux store
      dispatch(setTotalProfit(totalProfit)); // Update the overall profit in Redux

      // If sale is successful, update inventory stock
      for (const item of cart.items) {
        const updatedProduct = {
          id: item.id,
          quantity: item.quantity - item.cartQuantity, // Update stock by reducing quantity
        };
        
        await dispatch(updateInventoryStock(updatedProduct)).unwrap();

        // If stock is 0 after sale, remove the product from the inventory
        if (updatedProduct.quantity === 0) {
          await dispatch(removeProductFromInventory(item.id)).unwrap();
        }
      }

      // Clear the cart after the sale is successfully recorded
      dispatch(clearCart());
      setSearchTerm(""); // Reset search term
      setPaymentAmount(0); // Reset payment amount
      setPaymentMethod("cash"); // Reset payment method

      // Show success message and New Sale button
      setTransactionComplete(true);
      toast.success("Sale processed and payment completed successfully");
    } catch (error) {
      toast.error(`Failed to process sale: ${error.message || "Unknown error"}`);
    }
  };

  // Handle changing the payment method
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === "cash") {
      setPaymentAmount(cart.total);
    }
  };

  // Handle changing the payment amount
  const handlePaymentAmountChange = (event) => {
    setPaymentAmount(event.target.value);
  };

  // Handle starting a new sale
  const handleNewSale = () => {
    // Reset POS state for a new transaction
    dispatch(clearCart());
    setSearchTerm(""); // Reset search term
    setPaymentAmount(0); // Reset payment amount
    setPaymentMethod("cash"); // Reset payment method
    setTransactionComplete(false); // Hide success message
  };

  // Handle returning an item
  const handleReturn = (item) => {
    // Update inventory to increase stock
    const updatedProduct = {
      id: item.id,
      quantity: item.quantity + item.cartQuantity, // Increase stock by the quantity of returned items
    };

    dispatch(updateInventoryStock(updatedProduct));
    dispatch(removeFromCart(item.id)); // Remove the item from the cart after return
    toast.success(`${item.name} has been returned.`);
  };

  // Function to render icon dynamically based on the icon name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'FaBeer':
        return <FaBeer />;
      case 'FaApple':
        return <FaApple />;
      case 'FaCarrot':
        return <FaCarrot />;
      case 'FaCoffee':
        return <FaCoffee />;
      case 'FaLaptop':
        return <FaLaptop />;
      case 'FaPhone':
        return <FaPhone />;
      default:
        return null; // Return nothing if the icon is unknown
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-6">
      {/* Products Section */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {inventory
              .filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="p-4 border rounded-lg hover:border-indigo-500 transition-colors"
                >
                  <div className="w-full h-32 mb-3 flex items-center justify-center">
                    {renderIcon(product.icon)} {/* Displaying icon here */}
                  </div>
                  <h3 className="text-lg text-center font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-center text-sm text-gray-500">${product.price}</p>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white rounded-lg shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Current Sale</h2>
          <p className="text-sm text-gray-500">
            {format(new Date(), "MMM d, yyyy h:mm a")}
          </p>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {cart.items.length === 0 ? (
            <p className="text-center text-gray-500">No items in cart</p>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Qty: {item.cartQuantity}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-indigo-500"
                      onClick={() => handleQuantityChange(item.id, item.cartQuantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      className="text-indigo-500"
                      onClick={() => handleQuantityChange(item.id, item.cartQuantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleReturn(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between text-lg">
            <span>Total:</span>
            <span className="font-semibold">${cart.total.toFixed(2)}</span>
          </div>

          {/* Payment method section */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <button
                className={`py-1 px-4 rounded-md ${
                  paymentMethod === "cash" ? "bg-indigo-500 text-white" : "bg-white text-indigo-500"
                }`}
                onClick={() => handlePaymentMethodChange("cash")}
              >
                Cash
              </button>
              <button
                className={`py-1 px-4 rounded-md ${
                  paymentMethod === "card" ? "bg-indigo-500 text-white" : "bg-white text-indigo-500"
                }`}
                onClick={() => handlePaymentMethodChange("card")}
              >
                Card
              </button>
            </div>

            {paymentMethod === "cash" && (
              <div className="mt-2">
                <label className="block text-sm text-gray-700">Payment Amount</label>
                <input
                  type="number"
                  className="mt-1 w-full p-2 border rounded-md"
                  value={paymentAmount}
                  onChange={handlePaymentAmountChange}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6">
            <button
              className="w-full py-2 bg-green-500 text-white rounded-lg"
              onClick={handleCheckout}
            >
              Complete Sale
            </button>

            {transactionComplete && (
              <button
                className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleNewSale}
              >
                New Sale
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





// /** @jsxImportSource react */
// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Search, Plus, Minus, Trash2, CreditCard } from "lucide-react";
// import { format } from "date-fns";
// import toast from "react-hot-toast";

// // Redux actions
// import { fetchProducts, updateInventoryStock, removeProductFromInventory } from "../store/slices/inventorySlice";
// import { addToCart, removeFromCart, updateQuantity, clearCart } from "../store/slices/cartSlice";
// import { recordSale, updateProfit } from "../store/slices/salesSlice"; // Add updateProfit import

// export default function POS() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [transactionComplete, setTransactionComplete] = useState(false); // State to control success message display
//   const cart = useSelector((state) => state.cart);
//   const inventory = useSelector((state) => state.inventory.products);
//   const currentUser = useSelector((state) => state.auth.user); // Assuming user info is stored in authSlice
//   const dispatch = useDispatch();

//   // Fetch products when the component mounts
//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   // Handle adding a product to the cart
//   const handleAddToCart = (product) => {
//     const cartItem = cart.items.find((item) => item.id === product.id);
//     if (cartItem && cartItem.cartQuantity >= product.quantity) {
//       toast.error("Not enough stock available");
//       return;
//     }
//     if (product.quantity === 0) {
//       toast.error("Product out of stock");
//       return;
//     }
//     dispatch(addToCart(product));
//   };

//   // Handle quantity change in the cart
//   const handleQuantityChange = (id, newQuantity) => {
//     const product = inventory.find((p) => p.id === id);
//     if (product) {
//       const maxQuantity = product.quantity;
//       if (newQuantity <= maxQuantity && newQuantity >= 1) {
//         dispatch(updateQuantity({ id, quantity: newQuantity }));
//       } else {
//         toast.error("Not enough stock available");
//       }
//     }
//   };

//   // Function to calculate profit (without displaying cost to the user)
//   const calculateProfit = () => {
//     let totalProfit = 0;
//     cart.items.forEach((item) => {
//       const product = inventory.find((p) => p.id === item.id);
//       if (product) {
//         const costPrice = product.costPrice; // Assume costPrice is part of the product data
//         const salePrice = item.price;
//         const profit = (salePrice - costPrice) * item.cartQuantity;
//         totalProfit += profit;
//       }
//     });
//     return totalProfit;
//   };

//   // Handle the checkout process
//   const handleCheckout = async () => {
//     if (cart.items.length === 0) {
//       toast.error("Cart is empty");
//       return;
//     }

//     // Prepare sale data according to the API's expected format
//     const saleData = {
//       cashier_id: currentUser ? currentUser.id : 1,  // Use the logged-in cashier's ID or default to 1
//       items: cart.items.map((item) => ({
//         id: item.id,  // Use the item ID from cart
//         price: item.price,
//         product_id: item.id,  // Use the product ID from cart
//         product_name: item.name,  // Use the product name from the cart
//         quantity: item.cartQuantity,  // Ensure the cart quantity is used
//         sale_id: 1,  // Use the same sale_id for all items in the sale (if needed, generate this dynamically)
//       })),
//       payment_method: paymentMethod,
//       timestamp: new Date().toISOString(),
//       total: cart.total,
//     };

//     try {
//       // First, record the sale in the backend
//       const sale = await dispatch(recordSale(saleData)).unwrap(); // Record the sale

//       // Calculate profit from the cart items
//       const totalProfit = calculateProfit();
//       // Dispatch the profit to the Redux store
//       dispatch(updateProfit(totalProfit));

//       // If sale is successful, update inventory stock
//       for (const item of cart.items) {
//         const updatedProduct = {
//           id: item.id,
//           quantity: item.quantity - item.cartQuantity, // Update stock by reducing quantity
//         };
//         await dispatch(updateInventoryStock(updatedProduct)).unwrap();

//         // If stock is 0 after sale, remove the product from the inventory
//         if (updatedProduct.quantity === 0) {
//           await dispatch(removeProductFromInventory(item.id)).unwrap();
//         }
//       }

//       // Clear the cart after the sale is successfully recorded
//       dispatch(clearCart());
//       setSearchTerm(""); // Reset search term
//       setPaymentAmount(0); // Reset payment amount
//       setPaymentMethod("cash"); // Reset payment method

//       // Show success message and New Sale button
//       setTransactionComplete(true);
//       toast.success("Sale processed and payment completed successfully");
//     } catch (error) {
//       toast.error(`Failed to process sale: ${error.message || "Unknown error"}`);
//     }
//   };

//   // Handle changing the payment method
//   const handlePaymentMethodChange = (method) => {
//     setPaymentMethod(method);
//     if (method === "cash") {
//       setPaymentAmount(cart.total);
//     }
//   };

//   // Handle changing the payment amount
//   const handlePaymentAmountChange = (event) => {
//     setPaymentAmount(event.target.value);
//   };

//   // Handle starting a new sale
//   const handleNewSale = () => {
//     // Reset POS state for a new transaction
//     dispatch(clearCart());
//     setSearchTerm(""); // Reset search term
//     setPaymentAmount(0); // Reset payment amount
//     setPaymentMethod("cash"); // Reset payment method
//     setTransactionComplete(false); // Hide success message
//   };

//   // Handle returning an item
//   const handleReturn = (item) => {
//     // Update inventory to increase stock
//     const updatedProduct = {
//       id: item.id,
//       quantity: item.quantity + item.cartQuantity, // Increase stock by the quantity of returned items
//     };

//     dispatch(updateInventoryStock(updatedProduct));
//     dispatch(removeFromCart(item.id)); // Remove the item from the cart after return
//     toast.success(`${item.name} has been returned.`);
//   };

//   // Function to render icon dynamically based on the icon name
//   const renderIcon = (iconName) => {
//     switch (iconName) {
//       case 'FaBeer':
//         return <FaBeer />;
//       case 'FaApple':
//         return <FaApple />;
//       case 'FaCarrot':
//         return <FaCarrot />;
//       case 'FaCoffee':
//         return <FaCoffee />;
//       case 'FaLaptop':
//         return <FaLaptop />;
//       case 'FaPhone':
//         return <FaPhone />;
//       default:
//         return null; // Return nothing if the icon is unknown
//     }
//   };

//   return (
//     <div className="h-[calc(100vh-6rem)] flex gap-6">
//       {/* Products Section */}
//       <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm">
//         <div className="p-6 border-b border-gray-200">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             />
//           </div>
//         </div>

//         <div className="flex-1 p-6 overflow-y-auto">
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             {inventory
//               .filter((product) =>
//                 product.name.toLowerCase().includes(searchTerm.toLowerCase())
//               )
//               .map((product) => (
//                 <button
//                   key={product.id}
//                   onClick={() => handleAddToCart(product)}
//                   className="p-4 border rounded-lg hover:border-indigo-500 transition-colors"
//                 >
//                   <div className="w-full h-32 mb-3 flex items-center justify-center">
//                     {renderIcon(product.icon)} {/* Displaying icon here */}
//                   </div>
//                   <h3 className="font-medium text-gray-900">{product.name}</h3>
//                   <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
//                   <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
//                 </button>
//               ))}
//           </div>
//         </div>
//       </div>

//       {/* Cart Section */}
//       <div className="w-96 bg-white rounded-lg shadow-sm flex flex-col">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-900">Current Sale</h2>
//           <p className="text-sm text-gray-500">
//             {format(new Date(), "MMM d, yyyy h:mm a")}
//           </p>
//         </div>

//         <div className="flex-1 p-6 overflow-y-auto">
//           {cart.items.length === 0 ? (
//             <p className="text-center text-gray-500">No items in cart</p>
//           ) : (
//             <div className="space-y-4">
//               {cart.items.map((item) => (
//                 <div key={item.id} className="flex items-center gap-4">
//                   <div className="flex-1">
//                     <p>{item.name}</p>
//                     <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
//                     <p className="text-sm text-gray-500">Qty: {item.cartQuantity}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       className="text-indigo-500"
//                       onClick={() => handleQuantityChange(item.id, item.cartQuantity + 1)}
//                     >
//                       <Plus className="h-4 w-4" />
//                     </button>
//                     <button
//                       className="text-indigo-500"
//                       onClick={() => handleQuantityChange(item.id, item.cartQuantity - 1)}
//                     >
//                       <Minus className="h-4 w-4" />
//                     </button>
//                     <button
//                       className="text-red-500"
//                       onClick={() => handleReturn(item)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="p-6 border-t border-gray-200">
//           <div className="flex justify-between text-lg">
//             <span>Total:</span>
//             <span className="font-semibold">${cart.total.toFixed(2)}</span>
//           </div>

//           {/* Payment method section */}
//           <div className="mt-4">
//             <div className="flex items-center gap-2">
//               <button
//                 className={`py-1 px-4 rounded-md ${
//                   paymentMethod === "cash" ? "bg-indigo-500 text-white" : "bg-white text-indigo-500"
//                 }`}
//                 onClick={() => handlePaymentMethodChange("cash")}
//               >
//                 Cash
//               </button>
//               <button
//                 className={`py-1 px-4 rounded-md ${
//                   paymentMethod === "card" ? "bg-indigo-500 text-white" : "bg-white text-indigo-500"
//                 }`}
//                 onClick={() => handlePaymentMethodChange("card")}
//               >
//                 Card
//               </button>
//             </div>

//             {paymentMethod === "cash" && (
//               <div className="mt-2">
//                 <label className="block text-sm text-gray-700">Payment Amount</label>
//                 <input
//                   type="number"
//                   className="mt-1 w-full p-2 border rounded-md"
//                   value={paymentAmount}
//                   onChange={handlePaymentAmountChange}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Buttons */}
//           <div className="mt-6">
//             <button
//               className="w-full py-2 bg-green-500 text-white rounded-lg"
//               onClick={handleCheckout}
//             >
//               Complete Sale
//             </button>

//             {transactionComplete && (
//               <button
//                 className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg"
//                 onClick={handleNewSale}
//               >
//                 New Sale
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// /** @jsxImportSource react */
// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Search, Plus, Minus, Trash2, CreditCard } from "lucide-react";
// import { format } from "date-fns";
// import toast from "react-hot-toast";

// // Importing FontAwesome or other icon libraries
// import { FaBeer, FaApple, FaCarrot, FaCoffee, FaLaptop, FaPhone } from "react-icons/fa";

// // Redux actions
// import { fetchProducts, updateInventoryStock, removeProductFromInventory } from "../store/slices/inventorySlice";
// import { addToCart, removeFromCart, updateQuantity, clearCart } from "../store/slices/cartSlice";
// import { recordSale } from "../store/slices/salesSlice"; // Correct action import

// export default function POS() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [transactionComplete, setTransactionComplete] = useState(false); // State to control success message display
//   const cart = useSelector((state) => state.cart);
//   const inventory = useSelector((state) => state.inventory.products);
//   const currentUser = useSelector((state) => state.auth.user); // Assuming user info is stored in authSlice
//   const dispatch = useDispatch();

//   // Fetch products when the component mounts
//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   // Handle adding a product to the cart
//   const handleAddToCart = (product) => {
//     const cartItem = cart.items.find((item) => item.id === product.id);
//     if (cartItem && cartItem.cartQuantity >= product.quantity) {
//       toast.error("Not enough stock available");
//       return;
//     }
//     if (product.quantity === 0) {
//       toast.error("Product out of stock");
//       return;
//     }
//     dispatch(addToCart(product));
//   };

//   // Handle quantity change in the cart
//   const handleQuantityChange = (id, newQuantity) => {
//     const product = inventory.find((p) => p.id === id);
//     if (product) {
//       const maxQuantity = product.quantity;
//       if (newQuantity <= maxQuantity && newQuantity >= 1) {
//         dispatch(updateQuantity({ id, quantity: newQuantity }));
//       } else {
//         toast.error("Not enough stock available");
//       }
//     }
//   };

//   // Handle the checkout process
//   const handleCheckout = async () => {
//     if (cart.items.length === 0) {
//       toast.error("Cart is empty");
//       return;
//     }

//     // Prepare sale data according to the API's expected format
//     const saleData = {
//       cashier_id: currentUser ? currentUser.id : 1,  // Use the logged-in cashier's ID or default to 1
//       items: cart.items.map((item) => ({
//         id: item.id,  // Use the item ID from cart
//         price: item.price,
//         product_id: item.id,  // Use the product ID from cart
//         product_name: item.name,  // Use the product name from the cart
//         quantity: item.cartQuantity,  // Ensure the cart quantity is used
//         sale_id: 1,  // Use the same sale_id for all items in the sale (if needed, generate this dynamically)
//       })),
//       payment_method: paymentMethod,
//       timestamp: new Date().toISOString(),
//       total: cart.total,
//     };

//     try {
//       // First, record the sale in the backend
//       const sale = await dispatch(recordSale(saleData)).unwrap(); // Record the sale

//       // If sale is successful, update inventory stock
//       for (const item of cart.items) {
//         const updatedProduct = {
//           id: item.id,
//           quantity: item.quantity - item.cartQuantity, // Update stock by reducing quantity
//         };
//         await dispatch(updateInventoryStock(updatedProduct)).unwrap();

//         // If stock is 0 after sale, remove the product from the inventory
//         if (updatedProduct.quantity === 0) {
//           await dispatch(removeProductFromInventory(item.id)).unwrap();
//         }
//       }

//       // Clear the cart after the sale is successfully recorded
//       dispatch(clearCart());
//       setSearchTerm(""); // Reset search term
//       setPaymentAmount(0); // Reset payment amount
//       setPaymentMethod("cash"); // Reset payment method

//       // Show success message and New Sale button
//       setTransactionComplete(true);
//       toast.success("Sale processed and payment completed successfully");
//     } catch (error) {
//       toast.error(`Failed to process sale: ${error.message || "Unknown error"}`);
//     }
//   };

//   // Handle changing the payment method
//   const handlePaymentMethodChange = (method) => {
//     setPaymentMethod(method);
//     if (method === "cash") {
//       setPaymentAmount(cart.total);
//     }
//   };

//   // Handle changing the payment amount
//   const handlePaymentAmountChange = (event) => {
//     setPaymentAmount(event.target.value);
//   };

//   // Handle starting a new sale
//   const handleNewSale = () => {
//     // Reset POS state for a new transaction
//     dispatch(clearCart());
//     setSearchTerm(""); // Reset search term
//     setPaymentAmount(0); // Reset payment amount
//     setPaymentMethod("cash"); // Reset payment method
//     setTransactionComplete(false); // Hide success message
//   };

//   // Handle returning an item
//   const handleReturn = (item) => {
//     // Update inventory to increase stock
//     const updatedProduct = {
//       id: item.id,
//       quantity: item.quantity + item.cartQuantity, // Increase stock by the quantity of returned items
//     };

//     dispatch(updateInventoryStock(updatedProduct));
//     dispatch(removeFromCart(item.id)); // Remove the item from the cart after return
//     toast.success(`${item.name} has been returned.`);
//   };

//   // Function to render icon dynamically based on the icon name
//   const renderIcon = (iconName) => {
//     switch (iconName) {
//       case 'FaBeer':
//         return <FaBeer />;
//       case 'FaApple':
//         return <FaApple />;
//       case 'FaCarrot':
//         return <FaCarrot />;
//       case 'FaCoffee':
//         return <FaCoffee />;
//       case 'FaLaptop':
//         return <FaLaptop />;
//       case 'FaPhone':
//         return <FaPhone />;
//       default:
//         return null; // Return nothing if the icon is unknown
//     }
//   };

//   return (
//     <div className="h-[calc(100vh-6rem)] flex gap-6">
//       {/* Products Section */}
//       <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm">
//         <div className="p-6 border-b border-gray-200">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             />
//           </div>
//         </div>

//         <div className="flex-1 p-6 overflow-y-auto">
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             {inventory
//               .filter((product) =>
//                 product.name.toLowerCase().includes(searchTerm.toLowerCase())
//               )
//               .map((product) => (
//                 <button
//                   key={product.id}
//                   onClick={() => handleAddToCart(product)}
//                   className="p-4 border rounded-lg hover:border-indigo-500 transition-colors"
//                 >
//                   <div className="w-full h-32 mb-3 flex items-center justify-center">
//                     {renderIcon(product.icon)} {/* Displaying icon here */}
//                   </div>
//                   <h3 className="font-medium text-gray-900">{product.name}</h3>
//                   <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
//                   <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
//                 </button>
//               ))}
//           </div>
//         </div>
//       </div>

//       {/* Cart Section */}
//       <div className="w-96 bg-white rounded-lg shadow-sm flex flex-col">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-900">Current Sale</h2>
//           <p className="text-sm text-gray-500">
//             {format(new Date(), "MMM d, yyyy h:mm a")}
//           </p>
//         </div>

//         <div className="flex-1 p-6 overflow-y-auto">
//           {cart.items.length === 0 ? (
//             <p className="text-center text-gray-500">No items in cart</p>
//           ) : (
//             <div className="space-y-4">
//               {cart.items.map((item) => (
//                 <div key={item.id} className="flex items-center gap-4">
//                   <div className="flex-1">
//                     <p>{item.name}</p>
//                     <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
//                     <p className="text-sm text-gray-500">Qty: {item.cartQuantity}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       className="text-indigo-500"
//                       onClick={() => handleQuantityChange(item.id, item.cartQuantity + 1)}
//                     >
//                       <Plus className="h-4 w-4" />
//                     </button>
//                     <button
//                       className="text-indigo-500"
//                       onClick={() => handleQuantityChange(item.id, item.cartQuantity - 1)}
//                     >
//                       <Minus className="h-4 w-4" />
//                     </button>
//                     <button
//                       className="text-red-500"
//                       onClick={() => handleReturn(item)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="p-6 border-t border-gray-200">
//           <div className="flex justify-between text-lg">
//             <span>Total:</span>
//             <span className="font-semibold">${cart.total.toFixed(2)}</span>
//           </div>

//           {/* Payment method section */}
//           <div className="mt-4">
//             <div className="flex items-center gap-2">
//               <button
//                 className={`py-1 px-4 rounded-md ${
//                   paymentMethod === "cash" ? "bg-indigo-500 text-white" : "bg-white text-indigo-500"
//                 }`}
//                 onClick={() => handlePaymentMethodChange("cash")}
//               >
//                 Cash
//               </button>
//               <button
//                 className={`py-1 px-4 rounded-md ${
//                   paymentMethod === "card" ? "bg-indigo-500 text-white" : "bg-white text-indigo-500"
//                 }`}
//                 onClick={() => handlePaymentMethodChange("card")}
//               >
//                 Card
//               </button>
//             </div>

//             {paymentMethod === "cash" && (
//               <div className="mt-2">
//                 <label className="block text-sm text-gray-700">Payment Amount</label>
//                 <input
//                   type="number"
//                   className="mt-1 w-full p-2 border rounded-md"
//                   value={paymentAmount}
//                   onChange={handlePaymentAmountChange}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Buttons */}
//           <div className="mt-6">
//             <button
//               className="w-full py-2 bg-green-500 text-white rounded-lg"
//               onClick={handleCheckout}
//             >
//               Complete Sale
//             </button>

//             {transactionComplete && (
//               <button
//                 className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg"
//                 onClick={handleNewSale}
//               >
//                 New Sale
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
