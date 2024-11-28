/** @jsxImportSource react */
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateProductById, deleteProductById } from '../store/slices/inventorySlice';

// Import icons from Lucide React (or React Icons)
import { Package, ShoppingBag, Tv, Shirt } from 'lucide-react'; // Example icons

export default function InventoryCard({ product, role }) {
  const dispatch = useDispatch();

  // Function to get the appropriate icon based on the category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'electronics':
        return <Tv className="h-6 w-6 text-blue-600" />;
      case 'clothing':
        return <Shirt className="h-6 w-6 text-green-600" />;
      case 'home':
        return <Package className="h-6 w-6 text-yellow-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  // Handle product deletion
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete Ksh{product.name}?`)) {
      dispatch(deleteProductById(product.id));
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        {/* Display category icon */}
        <div className="flex items-center">
          {getCategoryIcon(product.category)}
          <div className="ml-3 text-sm font-medium text-gray-900">{product.name}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ksh{product.price.toFixed(2)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
      {role === 'admin' && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
          <button
            onClick={() => handleDelete()}
            className="text-red-500 hover:text-red-700 mx-2"
          >
            Delete
          </button>
        </td>
      )}
    </tr>
  );
}
