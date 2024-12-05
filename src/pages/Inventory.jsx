/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  createProduct,
  updateProductById,
  deleteProductById,
} from '../store/slices/inventorySlice';
import IconSearch from '../components/IconSearch';

export default function Inventory() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.inventory);
  const userRole = useSelector((state) => state.auth.user?.role);

  // State for handling the search and modal form
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    cost: 0,
    quantity: 0,
    reorder_point: 0,
    icon: '',
  });

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle search term update
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Handle form field change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle adding or editing product
  const handleSubmit = () => {
    if (
      productData.name &&
      productData.sku &&
      productData.category &&
      !isNaN(productData.price) &&
      productData.price > 0 &&
      !isNaN(productData.cost) &&
      productData.cost >= 0
    ) {
      if (productData.id) {
        dispatch(updateProductById(productData));
      } else {
        dispatch(createProduct(productData));
      }
      setIsModalOpen(false);
      resetForm();
    } else {
      alert('Please fill in all required fields correctly.');
    }
  };

  // Reset the form
  const resetForm = () => {
    setProductData({
      name: '',
      sku: '',
      category: '',
      price: 0,
      cost: 0,
      quantity: 0,
      reorder_point: 0,
      icon: '',
    });
  };

  // Handle product edit
  const handleEditProduct = (product) => {
    setProductData(product);
    setIsModalOpen(true);
  };

  // Handle product deletion
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProductById(id));
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Calculate summary stats (Total Stock, Total Stock Value, Total Cost)
  const getInventorySummary = () => {
    const totalQuantity = products.reduce((sum, product) => sum + (product.quantity || 0), 0);
    const totalValue = products.reduce(
      (sum, product) =>
        sum + (product.price && !isNaN(product.price) ? product.price * (product.quantity || 0) : 0),
      0
    );
    const totalCost = products.reduce(
      (sum, product) =>
        sum + (product.cost && !isNaN(product.cost) ? product.cost * (product.quantity || 0) : 0),
      0
    );

    return {
      totalQuantity,
      totalValue,
      totalCost,
    };
  };

  const { totalQuantity, totalValue, totalCost } = getInventorySummary();

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] overflow-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
        {(userRole === 'admin' || userRole === 'manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Product
          </button>
        )}
      </div>

      {/* Modal for Add/Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Add/Edit Product</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleFormChange}
                placeholder="Product Name"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                name="sku"
                value={productData.sku}
                onChange={handleFormChange}
                placeholder="SKU"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                name="category"
                value={productData.category}
                onChange={handleFormChange}
                placeholder="Category"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleFormChange}
                placeholder="Price"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="number"
                name="cost"
                value={productData.cost}
                onChange={handleFormChange}
                placeholder="Cost"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                onChange={handleFormChange}
                placeholder="Quantity"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="number"
                name="reorder_point"
                value={productData.reorder_point}
                onChange={handleFormChange}
                placeholder="Reorder Point"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
              />
              {/* Icon selection component */}
              <IconSearch
                selectedIcon={productData.icon}
                setSelectedIcon={(icon) => setProductData({ ...productData, icon })}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Summary */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Total Stock</h2>
            <p className="text-xl font-bold">{totalQuantity}</p>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Total Stock Value</h2>
            <p className="text-xl font-bold">Ksh {totalValue.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Total Cost</h2>
            <p className="text-xl font-bold">Ksh {totalCost.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="pl-4 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">Error: {error}</div>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="border px-6 py-3 text-sm font-semibold text-gray-700 text-center uppercase">No.</th>
                  <th className="border px-6 py-3 text-sm font-semibold text-gray-700 text-center uppercase">Product</th>
                  <th className="border px-6 py-3 text-sm font-semibold text-gray-700 text-center uppercase">SKU</th>
                  <th className="border px-6 py-3 text-sm font-semibold text-gray-700 text-center uppercase">Category</th>
                  <th className="border px-6 py-3 text-sm font-semibold text-gray-700 text-center uppercase">Price</th>
                  <th className="border px-6 py-3 text-sm font-semibold text-gray-700 text-center uppercase">Cost</th>
                  <th className="border px-6 py-3 text-sm font-semibold text-gray-700 text-center uppercase">Stock</th>
                  {userRole === 'admin' && (
                    <th className="border px-6 py-3 text-sm font-semibold text-gray-700 text-center uppercase">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      {product.price && !isNaN(product.price) ? product.price.toFixed(2) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      {product.cost && !isNaN(product.cost) ? product.cost.toFixed(2) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">{product.quantity}</td>
                    {userRole === 'admin' && (
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 ml-2"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
