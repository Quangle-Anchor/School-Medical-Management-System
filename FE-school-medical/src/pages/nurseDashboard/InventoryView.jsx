import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { inventoryAPI } from '../../api/inventoryApi';

const InventoryView = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inventoryData, setInventoryData] = useState({
    medications: [],
    equipment: [],
    consumables: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'medications',
    quantity: 0,
    unit: '',
    description: '',
    minThreshold: 10,
    maxThreshold: 50,
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const inventoryItems = await inventoryAPI.getAllInventory();
      console.log('Raw inventory data:', inventoryItems);
      
      // Transform the nested data structure to flat structure
      const transformedItems = inventoryItems.map(inventoryItem => {
        // Map backend categories to frontend categories
        let category = 'consumables'; // default
        const backendCategory = inventoryItem.item?.category?.toLowerCase() || '';
        
        if (backendCategory.includes('medicine') || backendCategory.includes('medication') || backendCategory.includes('drug')) {
          category = 'medications';
        } else if (backendCategory.includes('equipment') || backendCategory.includes('device') || backendCategory.includes('instrument')) {
          category = 'equipment';
        } else {
          category = 'consumables';
        }
        
        return {
          id: inventoryItem.inventoryId,
          name: inventoryItem.item?.itemName || inventoryItem.item?.name || 'Unknown Item',
          itemName: inventoryItem.item?.itemName || inventoryItem.item?.name || 'Unknown Item',
          category: category,
          description: inventoryItem.item?.description || '',
          quantity: inventoryItem.totalQuantity || 0,
          unit: inventoryItem.item?.unit || 'units',
          manufacturer: inventoryItem.item?.manufacturer || '',
          expiryDate: inventoryItem.item?.expiryDate || '',
          storageInstructions: inventoryItem.item?.storageInstructions || '',
          minThreshold: inventoryItem.item?.minThreshold || 10,
          maxThreshold: inventoryItem.item?.maxThreshold || 50,
          updatedAt: inventoryItem.updatedAt,
          createdAt: inventoryItem.item?.createdAt || inventoryItem.createdAt
        };
      });
      
      console.log('Transformed inventory data:', transformedItems);
      const categorizedData = inventoryAPI.categorizeInventory(transformedItems);
      console.log('Categorized inventory data:', categorizedData);
      setInventoryData(categorizedData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventoryData({
        medications: [],
        equipment: [],
        consumables: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchInventory();
      return;
    }

    try {
      const searchResults = await inventoryAPI.searchInventory(searchTerm);
      console.log('Raw search results:', searchResults);
      
      // Transform the nested data structure to flat structure
      const transformedItems = searchResults.map(inventoryItem => {
        // Map backend categories to frontend categories
        let category = 'consumables'; // default
        const backendCategory = inventoryItem.item?.category?.toLowerCase() || '';
        
        if (backendCategory.includes('medicine') || backendCategory.includes('medication') || backendCategory.includes('drug')) {
          category = 'medications';
        } else if (backendCategory.includes('equipment') || backendCategory.includes('device') || backendCategory.includes('instrument')) {
          category = 'equipment';
        } else {
          category = 'consumables';
        }
        
        return {
          id: inventoryItem.inventoryId,
          name: inventoryItem.item?.itemName || inventoryItem.item?.name || 'Unknown Item',
          itemName: inventoryItem.item?.itemName || inventoryItem.item?.name || 'Unknown Item',
          category: category,
          description: inventoryItem.item?.description || '',
          quantity: inventoryItem.totalQuantity || 0,
          unit: inventoryItem.item?.unit || 'units',
          manufacturer: inventoryItem.item?.manufacturer || '',
          expiryDate: inventoryItem.item?.expiryDate || '',
          storageInstructions: inventoryItem.item?.storageInstructions || '',
          minThreshold: inventoryItem.item?.minThreshold || 10,
          maxThreshold: inventoryItem.item?.maxThreshold || 50,
          updatedAt: inventoryItem.updatedAt,
          createdAt: inventoryItem.item?.createdAt || inventoryItem.createdAt
        };
      });
      
      const categorizedData = inventoryAPI.categorizeInventory(transformedItems);
      setInventoryData(categorizedData);
    } catch (error) {
      console.error('Error searching inventory:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding item with data:', formData);
      
      // Map frontend category back to backend category
      let backendCategory = formData.category;
      if (formData.category === 'medications') {
        backendCategory = 'Medicine';
      } else if (formData.category === 'equipment') {
        backendCategory = 'Equipment';
      } else {
        backendCategory = 'Consumables';
      }
      
      // Structure the data to match backend expectations
      const itemData = {
        // Item properties
        itemName: formData.name,
        category: backendCategory,
        unit: formData.unit,
        description: formData.description || '',
        minThreshold: formData.minThreshold || 10,
        maxThreshold: formData.maxThreshold || 50,
        // Inventory level properties
        totalQuantity: formData.quantity
      };
      
      console.log('Sending add request with data:', itemData);
      await inventoryAPI.addInventoryItem(itemData);
      setShowAddModal(false);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error('Error adding item:', error);
      alert(`Failed to add item: ${error.message || 'Please check your permissions.'}`);
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      console.log('Editing item with data:', formData);
      console.log('Selected item:', selectedItem);
      
      // Map frontend category back to backend category
      let backendCategory = formData.category;
      if (formData.category === 'medications') {
        backendCategory = 'Medicine';
      } else if (formData.category === 'equipment') {
        backendCategory = 'Equipment';
      } else {
        backendCategory = 'Consumables';
      }
      
      // Structure the data to match backend expectations
      // It seems the backend expects updates to both item properties and inventory quantity
      const itemData = {
        // Item properties
        itemName: formData.name,
        category: backendCategory,
        unit: formData.unit,
        description: formData.description || '',
        minThreshold: formData.minThreshold || 10,
        maxThreshold: formData.maxThreshold || 50,
        // Inventory level properties
        totalQuantity: formData.quantity
      };
      
      console.log('Sending update request with data:', itemData);
      await inventoryAPI.updateInventoryItem(selectedItem.id, itemData);
      setShowEditModal(false);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error('Error updating item:', error);
      alert(`Failed to update item: ${error.message || 'Please check your permissions.'}`);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await inventoryAPI.deleteInventoryItem(selectedItem.id);
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please check your permissions.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'medications',
      quantity: 0,
      unit: '',
      description: '',
      minThreshold: 10,
      maxThreshold: 50,
    });
    setSelectedItem(null);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || item.itemName || '',
      category: item.category || 'consumables',
      quantity: item.quantity || 0,
      unit: item.unit || '',
      description: item.description || '',
      minThreshold: item.minThreshold || 10,
      maxThreshold: item.maxThreshold || 50,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const getStatusColor = (item) => {
    const status = item.status || inventoryAPI.getStockStatus(item.quantity);
    switch (status) {
      case 'good': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      medications: '💊',
      equipment: '🔬',
      consumables: '🧤'
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category) => {
    const colors = {
      medications: 'border-blue-300 bg-blue-50',
      equipment: 'border-green-300 bg-green-50',
      consumables: 'border-purple-300 bg-purple-50'
    };
    return colors[category] || 'border-gray-300 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const allItems = [...inventoryData.medications, ...inventoryData.equipment, ...inventoryData.consumables];
  const totalItems = allItems.length;
  const lowStockItems = allItems.filter(item => 
    (item.status || inventoryAPI.getStockStatus(item.quantity)) === 'low'
  ).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="mr-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              ← Back
            </button>
          )}
          <h1 className="text-2xl font-bold">
            {selectedCategory ? 
              `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Inventory` : 
              'Medical Inventory'
            }
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {!selectedCategory ? (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Total Items</h3>
              <p className="text-3xl font-bold text-blue-600">{totalItems}</p>
              <p className="text-sm text-gray-500">Active supplies</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Low Stock</h3>
              <p className="text-3xl font-bold text-red-600">{lowStockItems}</p>
              <p className="text-sm text-gray-500">Need reorder</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Medications</h3>
              <p className="text-3xl font-bold text-green-600">{inventoryData.medications.length}</p>
              <p className="text-sm text-gray-500">Medicine items</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Equipment</h3>
              <p className="text-3xl font-bold text-purple-600">{inventoryData.equipment.length}</p>
              <p className="text-sm text-gray-500">Medical equipment</p>
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(inventoryData).map(([category, items]) => (
              <div 
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 ${getCategoryColor(category)} hover:border-opacity-80`}
              >
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                  <h3 className="text-xl font-semibold text-gray-800 capitalize">{category}</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Total Items: {items.length}</p>
                  <p className="text-sm text-gray-600">
                    Low Stock: {items.filter(item => {
                      const status = item.status || inventoryAPI.getStockStatus(item.quantity);
                      return status === 'low';
                    }).length} items
                  </p>
                  <div className="mt-4">
                    <div className="text-xs text-gray-500">Recent items:</div>
                    <div className="text-sm">
                      {items.slice(0, 3).map(item => item.name || item.itemName).join(', ')}
                      {items.length > 3 ? '...' : ''}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-blue-600 text-sm font-medium">Click to view all →</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Category Detail View
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryData[selectedCategory]?.map((item) => {
              const status = item.status || inventoryAPI.getStockStatus(item.quantity);
              return (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{item.name || item.itemName}</h4>
                    <span className={`text-sm font-semibold ${getStatusColor(item)}`}>
                      {item.quantity} {item.unit || 'units'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <span>Stock Level: {status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 flex items-center space-x-1"
                    >
                      <PencilIcon className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => openDeleteModal(item)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 flex items-center space-x-1"
                    >
                      <TrashIcon className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <form onSubmit={handleAddItem}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="medications">Medications</option>
                    <option value="equipment">Equipment</option>
                    <option value="consumables">Consumables</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., boxes, units, ml"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {setShowAddModal(false); resetForm();}}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>
            <form onSubmit={handleEditItem}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="medications">Medications</option>
                    <option value="equipment">Equipment</option>
                    <option value="consumables">Consumables</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., boxes, units, ml"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {setShowEditModal(false); resetForm();}}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-xl font-bold">Confirm Delete</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedItem?.name || selectedItem?.itemName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {setShowDeleteModal(false); setSelectedItem(null);}}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
