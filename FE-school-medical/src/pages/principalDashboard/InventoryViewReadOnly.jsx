import React, { useState, useEffect } from 'react';
import { Search, Package, AlertTriangle, Heart, Activity } from 'lucide-react';
import { inventoryAPI } from '../../api/inventoryApi';

const InventoryViewReadOnly = () => {
  const [inventoryData, setInventoryData] = useState({
    medications: [],
    equipment: [],
    consumables: []
  });
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Fetch inventory data for the inventory view
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const inventory = await inventoryAPI.getAllInventory();
      
      // Group inventory items by category
      const grouped = {
        medications: [],
        equipment: [],
        consumables: []
      };

      inventory.forEach(inventoryItem => {
        const backendCategory = inventoryItem.item?.category?.toLowerCase() || '';
        let frontendCategory = 'consumables'; // Default category

        if (backendCategory.includes('medication') || backendCategory.includes('medicine') || backendCategory.includes('drug')) {
          frontendCategory = 'medications';
        } else if (backendCategory.includes('equipment') || backendCategory.includes('device') || backendCategory.includes('tool')) {
          frontendCategory = 'equipment';
        }

        const item = {
          id: inventoryItem.inventoryId,
          name: inventoryItem.item?.itemName || 'Unknown Item',
          quantity: inventoryItem.totalQuantity || 0,
          unit: inventoryItem.item?.unit || 'units',
          description: inventoryItem.item?.description || 'No description',
          manufacturer: inventoryItem.item?.manufacturer || 'Unknown',
          expiryDate: inventoryItem.item?.expiryDate || '',
          storageInstructions: inventoryItem.item?.storageInstructions || '',
          minThreshold: 10, // Default values since these aren't in the backend model
          maxThreshold: 50, // Default values since these aren't in the backend model
          category: frontendCategory,
          status: inventoryAPI.getStockStatus(inventoryItem.totalQuantity || 0)
        };

        grouped[frontendCategory].push(item);
      });

      setInventoryData(grouped);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const allItems = [...inventoryData.medications, ...inventoryData.equipment, ...inventoryData.consumables];
  const totalItems = allItems.length;
  const lowStockItemsCount = allItems.filter(item => 
    (item.status || inventoryAPI.getStockStatus(item.quantity)) === 'low'
  ).length;

  const getFilteredItems = () => {
    if (selectedCategory) {
      return inventoryData[selectedCategory].filter(item =>
        item.name.toLowerCase().includes(inventorySearchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(inventorySearchTerm.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(inventorySearchTerm.toLowerCase())
      );
    }
    return allItems.filter(item =>
      item.name.toLowerCase().includes(inventorySearchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(inventorySearchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(inventorySearchTerm.toLowerCase())
    );
  };

  const filteredItems = getFilteredItems();

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'good': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading inventory...</p>
        </div>
      </div>
    );
  }

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedCategory 
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Inventory`
                : 'Medical Inventory Overview'
              }
            </h1>
            <p className="text-gray-600">
              {selectedCategory 
                ? `View ${selectedCategory} items and stock levels`
                : 'Complete overview of medical supplies, equipment, and pharmaceuticals'
              }
            </p>
          </div>
        </div>
      </div>

      {!selectedCategory ? (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Total Items</h3>
                  <p className="text-3xl font-bold text-blue-600">{totalItems}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Low Stock</h3>
                  <p className="text-3xl font-bold text-red-600">{lowStockItemsCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Medications</h3>
                  <p className="text-3xl font-bold text-purple-600">{inventoryData.medications.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Equipment</h3>
                  <p className="text-3xl font-bold text-green-600">{inventoryData.equipment.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(inventoryData).map(([category, items]) => {
              const lowStock = items.filter(item => 
                (item.status || inventoryAPI.getStockStatus(item.quantity)) === 'low'
              ).length;
              
              return (
                <div 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold capitalize">{category}</h3>
                    <span className="text-sm text-gray-500">{items.length} items</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Items:</span>
                      <span className="font-medium">{items.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Low Stock:</span>
                      <span className={`font-medium ${lowStock > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {lowStock}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Search Bar */}
          <div className="p-6 border-b">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${selectedCategory}...`}
                value={inventorySearchTerm}
                onChange={(e) => setInventorySearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Items List */}
          <div className="p-6">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStockStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium">{item.quantity} {item.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Manufacturer:</span>
                        <span className="font-medium truncate ml-2">{item.manufacturer}</span>
                      </div>
                      {item.expiryDate && (
                        <div className="flex justify-between">
                          <span>Expires:</span>
                          <span className="font-medium">{new Date(item.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    
                    {item.storageInstructions && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          <strong>Storage:</strong> {item.storageInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  {inventorySearchTerm 
                    ? `No ${selectedCategory} found matching your search.` 
                    : `No ${selectedCategory} available.`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryViewReadOnly;
