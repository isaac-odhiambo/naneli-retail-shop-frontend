/** @jsxImportSource react */
import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteProductById } from '../store/slices/inventorySlice';

// Import icons dynamically based on the product's icon name (from Lucide)
import * as Icons from 'lucide-react';

export default function InventoryCard({ product, role, onEdit }) {
  const dispatch = useDispatch();

  // Function to get the appropriate icon based on the icon name
  const getCategoryIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    if (IconComponent) {
      return <IconComponent className="h-6 w-6 text-gray-500" />;
    }
    return <Icons.Package className="h-6 w-6 text-gray-500" />;
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      dispatch(deleteProductById(product.id));
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getCategoryIcon(product.icon)} {/* Display icon dynamically */}
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
            onClick={() => onEdit(product)} // Edit functionality
            className="text-blue-500 hover:text-blue-700 mx-2"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 mx-2"
          >
            Delete
          </button>
        </td>
      )}
    </tr>
  );
}
