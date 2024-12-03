/** @jsxImportSource react */
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';  // Importing icons for edit and delete actions

const InventoryCard = ({ product, role, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
        {/* Display the icon if it's present */}
        {product.icon ? (
          <span className={`text-2xl mr-2 ${product.icon}`} />
        ) : (
          <span className="text-gray-400 mr-2">No Icon</span>  // Fallback message if no icon is selected
        )}
        {product.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
      {role === 'admin' && (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 flex space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-900"
          >
            <FaTrash />
          </button>
        </td>
      )}
    </tr>
  );
};

export default InventoryCard;


// /** @jsxImportSource react */
// import React from 'react';
// import { useDispatch } from 'react-redux';
// import { deleteProductById } from '../store/slices/inventorySlice';

// // Import icons dynamically based on the product's icon name (from Lucide)
// import * as Icons from 'lucide-react';

// export default function InventoryCard({ product, role, onEdit }) {
//   const dispatch = useDispatch();

//   // Function to get the appropriate icon based on the icon name
//   const getCategoryIcon = (iconName) => {
//     const IconComponent = Icons[iconName];
//     if (IconComponent) {
//       return <IconComponent className="h-6 w-6 text-gray-500" />;
//     }
//     return <Icons.Package className="h-6 w-6 text-gray-500" />;
//   };

//   const handleDelete = () => {
//     if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
//       dispatch(deleteProductById(product.id));
//     }
//   };

//   return (
//     <tr>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center">
//           {getCategoryIcon(product.icon)} {/* Display icon dynamically */}
//           <div className="ml-3 text-sm font-medium text-gray-900">{product.name}</div>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
//       {role === 'admin' && (
//         <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
//           <button
//             onClick={() => onEdit(product)} // Edit functionality
//             className="text-blue-500 hover:text-blue-700 mx-2"
//           >
//             Edit
//           </button>
//           <button
//             onClick={handleDelete}
//             className="text-red-500 hover:text-red-700 mx-2"
//           >
//             Delete
//           </button>
//         </td>
//       )}
//     </tr>
//   );
// }
