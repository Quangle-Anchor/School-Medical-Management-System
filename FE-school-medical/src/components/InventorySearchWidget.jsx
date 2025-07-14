import React, { useState, useEffect } from 'react';
import { inventoryAPI } from '../api/inventoryApi';
import { Search, Package, AlertCircle, CheckCircle, X } from 'lucide-react';

const InventorySearchWidget = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allInventory, setAllInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      console.log('InventorySearchWidget opened, fetching inventory...');
      fetchAllInventory();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim()) {
      performSearch();
    } else {
      setSearchResults(allInventory);
    }
  }, [searchTerm, allInventory]);

  const fetchAllInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check authentication first
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      console.log('Authentication check - Token:', token ? 'Present' : 'Missing', 'Role:', role);
      
      console.log('Fetching all inventory...');
      const data = await inventoryAPI.getAllInventory();
      console.log('Received inventory data:', data);
      
      if (Array.isArray(data)) {
        setAllInventory(data);
        setSearchResults(data);
        console.log(`Loaded ${data.length} inventory items`);
        // Debug: Log the structure of the first item
        if (data.length > 0) {
          console.log('Sample item structure:', JSON.stringify(data[0], null, 2));
        }
      } else {
        console.warn('Invalid data format received:', data);
        setAllInventory([]);
        setSearchResults([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError(`Failed to fetch inventory items: ${error.message}`);
      setAllInventory([]);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('Performing search for:', searchTerm);
      const results = await inventoryAPI.searchInventory(searchTerm);
      console.log('Search results:', results);
      
      if (Array.isArray(results)) {
        setSearchResults(results);
        console.log(`Found ${results.length} search results`);
      } else {
        console.warn('Invalid search results format:', results);
        setSearchResults([]);
        setError('Invalid search results format');
      }
    } catch (error) {
      console.error('Error searching inventory:', error);
      setError(`Failed to search inventory: ${error.message}`);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'out', color: 'red', text: 'Out of Stock' };
    if (quantity < 10) return { status: 'low', color: 'yellow', text: 'Low Stock' };
    return { status: 'available', color: 'green', text: 'Available' };
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center">
          <Package className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Inventory Search</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medical supplies..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto max-h-96">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 text-sm">Searching...</span>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'No items found' : 'No inventory items available'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {searchResults.map((item) => {
              const quantity = item.totalQuantity || item.quantity || 0;
              const stockInfo = getStockStatus(quantity);
              return (
                <div 
                  key={item.inventoryId || item.itemId || item.id} 
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.item?.itemName || item.itemName || item.name || 'Unknown Item'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.item?.description || item.description || 'No description available'}
                      </p>
                      {(item.expiryDate || item.item?.expiryDate) && (
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {new Date(item.expiryDate || item.item?.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                      {(item.item?.category || item.category) && (
                        <p className="text-xs text-blue-600 mt-1">
                          Category: {item.item?.category || item.category}
                        </p>
                      )}
                    </div>
                    <div className="ml-3 text-right">
                      <div className="flex items-center justify-end mb-1">
                        <span className="text-lg font-semibold text-gray-900">
                          {quantity}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          {item.unit || 'units'}
                        </span>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${stockInfo.color === 'green' ? 'bg-green-100 text-green-800' : 
                          stockInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {stockInfo.color === 'green' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {stockInfo.color === 'red' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {stockInfo.text}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t">
        <p className="text-xs text-gray-500 text-center">
          Total items: {searchResults.length} | 
          Available: {searchResults.filter(item => (item.totalQuantity || item.quantity || 0) > 0).length} | 
          Out of stock: {searchResults.filter(item => (item.totalQuantity || item.quantity || 0) === 0).length}
        </p>
      </div>
    </div>
  );
};

export default InventorySearchWidget;
