/** @jsxImportSource react */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { FaApple, FaBeer, FaCarrot, FaCoffee, FaLaptop, FaPhone } from 'react-icons/fa';

// Redux actions
import { fetchProducts, updateInventoryStock, removeProductFromInventory } from "../store/slices/inventorySlice";
import { addToCart, removeFromCart, updateQuantity, clearCart } from "../store/slices/cartSlice";
import { recordSale, setTotalProfit, setFilteredProfit } from "../store/slices/salesSlice"; 

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

  // Handle adding a product to the cart by clicking on the product icon
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
        const costPrice = product.cost; // Assume costPrice is part of the product data
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
        id: item.id,  
        price: item.price,
        product_cost: item.costPrice,  
        product_id: item.id,  
        product_name: item.name,  
        product_price: item.price,  
        quantity: item.cartQuantity,  
        sale_id: 1,  
      })),
      payment_method: paymentMethod, 
      timestamp: new Date().toISOString(),
      total: cart.total,
    };

    try {
      // First, record the sale in the backend
      const sale = await dispatch(recordSale(saleData)).unwrap();

      // Log profit calculation
      let totalProfit = 0;
      cart.items.forEach((item) => {
        const product = inventory.find((p) => p.id === item.id);
        if (product) {
          const costPrice = product.cost;
          const salePrice = item.price;
          const profit = (salePrice - costPrice) * item.cartQuantity;
          totalProfit += profit;
        }
      });

      // Dispatch the profit to the Redux store
      dispatch(setTotalProfit(totalProfit));

      // Update inventory stock and remove product if stock reaches zero
      for (const item of cart.items) {
        const updatedProduct = {
          id: item.id,
          quantity: inventory.find((p) => p.id === item.id)?.quantity - item.cartQuantity,
        };

        await dispatch(updateInventoryStock(updatedProduct)).unwrap();

        if (updatedProduct.quantity <= 0) {
          await dispatch(removeProductFromInventory(item.id)).unwrap();
        }
      }

      // Clear the cart after the sale is successfully recorded
      dispatch(clearCart());
      setSearchTerm(""); 
      setPaymentAmount(0); 
      setPaymentMethod("cash"); 

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
    dispatch(clearCart());
    setSearchTerm(""); 
    setPaymentAmount(0); 
    setPaymentMethod("cash"); 
    setTransactionComplete(false); 
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
        return null;
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-6rem)] overflow-hidden">
      {/* Products Section */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid of products */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-auto">
          {inventory
            .filter((product) =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product) => (
              <div
                key={product.id}
                onClick={() => handleAddToCart(product)}
                className="cursor-pointer text-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-center mb-4">
                  {renderIcon(product.icon)} {/* Render product icon */}
                </div>
                <span className="font-semibold text-sm">{product.name}</span>
                <div className="mt-1 text-xs text-gray-500">Stock: {product.quantity}</div>
                <div className="text-lg font-bold mt-2">Ksh {product.price}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-1/3 flex flex-col bg-white rounded-lg shadow-sm overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Cart</h2>
        </div>
        <div className="p-6 overflow-auto">
          {cart.items.length === 0 ? (
            <div>No items in cart</div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  {renderIcon(item.icon)} {/* Render item icon */}
                  <span className="ml-2">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.cartQuantity - 1)}
                    className="px-2 py-1 bg-gray-300 rounded-md"
                  >
                    <Minus />
                  </button>
                  <span className="mx-2">{item.cartQuantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.cartQuantity + 1)}
                    className="px-2 py-1 bg-gray-300 rounded-md"
                  >
                    <Plus />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleReturn(item)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                  >
                    Return
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    <Trash2 className="text-white" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout and Payment */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between mb-4">
            <div className="text-lg font-semibold">Total: Ksh {cart.total}</div>
            <div className="text-lg font-semibold">Profit: Ksh {calculateProfit()}</div>
          </div>
          <div className="mb-4">
            <label className="block text-sm">Payment Method</label>
            <div className="flex space-x-4">
              <button
                onClick={() => handlePaymentMethodChange("cash")}
                className={`py-2 px-4 rounded-md ${paymentMethod === "cash" ? "bg-green-500 text-white" : "bg-gray-200"}`}
              >
                Cash
              </button>
              <button
                onClick={() => handlePaymentMethodChange("mpesa")}
                className={`py-2 px-4 rounded-md ${paymentMethod === "mpesa" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                MPESA
              </button>
            </div>
          </div>
          {paymentMethod === "cash" && (
            <div className="mb-4">
              <label className="block text-sm">Amount Paid</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={paymentAmount}
                onChange={handlePaymentAmountChange}
              />
            </div>
          )}
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

