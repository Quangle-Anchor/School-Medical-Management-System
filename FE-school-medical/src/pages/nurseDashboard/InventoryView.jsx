import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

// Add CSS animation style in index.css
import { inventoryAPI } from '../../api/inventoryApi';
import {formatDateForInput } from '../../utils/dateUtils';

const InventoryView = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inventoryData, setInventoryData] = useState({
    medications: [],
    equipment: [],
    consumables: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExistingItemsModal, setShowExistingItemsModal] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [medicalItems, setMedicalItems] = useState([]);
  const [loadingMedicalItems, setLoadingMedicalItems] = useState(false);
  const [medicalItemSearchTerm, setMedicalItemSearchTerm] = useState('');
  const [selectedMedicalItem, setSelectedMedicalItem] = useState(null);
  const [showAddQuantityForm, setShowAddQuantityForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'medications',
    quantity: 0,
    unit: '',
    description: '',
    manufacturer: '',
    expiryDate: '',
    storageInstructions: '',
    minThreshold: 10,
    maxThreshold: 50,
  });

  useEffect(() => {
    fetchInventory();
  }, []);
  
  // Fetch medical items when showing the existing items modal
  useEffect(() => {
    if (showExistingItemsModal) {
      fetchMedicalItems();
      setMedicalItemSearchTerm(''); // Reset search term when opening modal
      setSelectedMedicalItem(null); // Reset selected item
      setShowAddQuantityForm(false); // Reset quantity form visibility
    }
  }, [showExistingItemsModal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAddDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAddDropdown(false);
      }
      
      // Close search results when clicking outside
      if (showSearchResults && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddDropdown, showSearchResults]);

  // Handle keyboard events for the dropdown
  const handleDropdownKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowAddDropdown(false);
      return;
    }

    if (!showAddDropdown) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setShowAddDropdown(true);
      }
    } else {
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const focusableElements = dropdownRef.current.querySelectorAll('button[role="menuitem"]');
        const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement);
        
        if (e.key === 'ArrowDown' && currentIndex < focusableElements.length - 1) {
          focusableElements[currentIndex + 1].focus();
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
          focusableElements[currentIndex - 1].focus();
        } else if (e.key === 'ArrowUp' && currentIndex === 0) {
          // If at the first item, loop to the last item
          focusableElements[focusableElements.length - 1].focus();
        } else if (e.key === 'ArrowDown' && currentIndex === focusableElements.length - 1) {
          // If at the last item, loop to the first item
          focusableElements[0].focus();
        }
      }
    }
  };

  // Focus the first item when dropdown opens
  useEffect(() => {
    if (showAddDropdown && dropdownRef.current) {
      const firstItem = dropdownRef.current.querySelector('button[role="menuitem"]');
      if (firstItem) {
        // Small delay to ensure the dropdown is fully rendered
        setTimeout(() => firstItem.focus(), 50);
      }
    }
  }, [showAddDropdown]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const inventoryItems = await inventoryAPI.getAllInventory();
      
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
          name: inventoryItem.item?.itemName || 'Unknown Item',
          itemName: inventoryItem.item?.itemName || 'Unknown Item',
          category: category,
          description: inventoryItem.item?.description || '',
          quantity: inventoryItem.totalQuantity || 0,
          unit: inventoryItem.item?.unit || 'units',
          manufacturer: inventoryItem.item?.manufacturer || '',
          expiryDate: inventoryItem.item?.expiryDate ? formatDateForInput(inventoryItem.item.expiryDate) : '',
          storageInstructions: inventoryItem.item?.storageInstructions || '',
          minThreshold: 10, // Default values since these aren't in the backend model
          maxThreshold: 50, // Default values since these aren't in the backend model
          updatedAt: inventoryItem.updatedAt,
          createdAt: inventoryItem.item?.createdAt || inventoryItem.updatedAt
        };
      });
      
      const categorizedData = inventoryAPI.categorizeInventory(transformedItems);
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

  // Fetch available medical items from the backend
  const fetchMedicalItems = async () => {
    try {
      setLoadingMedicalItems(true);
      const items = await inventoryAPI.getMedicalItems();
      setMedicalItems(items);
    } catch (error) {
      console.error('Error fetching medical items:', error);
      alert('Failed to fetch medical items. Please try again later.');
    } finally {
      setLoadingMedicalItems(false);
    }
  };

  // Filter medical items based on search term
  const filteredMedicalItems = medicalItems.filter(item => 
    item?.itemName?.toLowerCase().includes(medicalItemSearchTerm.toLowerCase()) ||
    item?.description?.toLowerCase().includes(medicalItemSearchTerm.toLowerCase()) ||
    item?.manufacturer?.toLowerCase().includes(medicalItemSearchTerm.toLowerCase()) ||
    item?.category?.toLowerCase().includes(medicalItemSearchTerm.toLowerCase())
  );

  // Select an item to add to inventory
  const selectItemToAdd = (item) => {
    setSelectedMedicalItem(item);
    setShowAddQuantityForm(true);
    // Reset quantity to 1 when selecting an item for better user experience
    setFormData(prevData => ({
      ...prevData,
      quantity: 1
    }));
  };
  
  // Handle adding an existing item to inventory
  const handleAddExistingItem = async () => {
    try {
      if (!selectedMedicalItem) {
        alert('Please select an item first');
        return;
      }
      
      if (!formData.quantity || formData.quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
      }
      
      // Show loading state
      const quantity = formData.quantity; // Store quantity for success message
      
      await inventoryAPI.addExistingItemToInventory(selectedMedicalItem.itemId, formData.quantity);
      
      // Close modals and reset state
      setShowExistingItemsModal(false);
      setSelectedMedicalItem(null);
      setShowAddQuantityForm(false);
      resetForm();
      fetchInventory();
      
      // Show success notification (could be enhanced with a toast component)
      alert(`Successfully added ${quantity} ${selectedMedicalItem.unit || 'units'} of ${selectedMedicalItem.itemName} to inventory`);
    } catch (error) {
      console.error('Error adding existing item to inventory:', error);
      alert(`Failed to add item: ${error.message || 'Please check your permissions.'}`);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchInventory();
      setShowSearchResults(false);
      return;
    }
    
    try {
      setLoading(true);
      const searchResults = await inventoryAPI.searchInventory(searchTerm);
      
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
          name: inventoryItem.item?.itemName || 'Unknown Item',
          itemName: inventoryItem.item?.itemName || 'Unknown Item',
          category: category,
          description: inventoryItem.item?.description || '',
          quantity: inventoryItem.totalQuantity || 0,
          unit: inventoryItem.item?.unit || 'units',
          manufacturer: inventoryItem.item?.manufacturer || '',
          expiryDate: inventoryItem.item?.expiryDate || '',
          storageInstructions: inventoryItem.item?.storageInstructions || '',
          minThreshold: 10, // Default values
          maxThreshold: 50, // Default values
          updatedAt: inventoryItem.updatedAt,
          createdAt: inventoryItem.item?.createdAt || inventoryItem.updatedAt,
          highlightMatch: true // Flag to indicate this is from a search result
        };
      });
      
      setSearchResults(transformedItems);
      setShowSearchResults(true);
      
      const categorizedData = inventoryAPI.categorizeInventory(transformedItems);
      setInventoryData(categorizedData);
      
      // Clear selected category to show all search results organized by category
      setSelectedCategory(null);
      
      // Show a message if no results
      if (transformedItems.length === 0) {
        alert(`No items found matching "${searchTerm}"`);
      }
    } catch (error) {
      console.error('Error searching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle live search as user types
  const handleLiveSearch = async (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }
    
    try {
      const searchResults = await inventoryAPI.searchInventory(term);
      
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
          name: inventoryItem.item?.itemName || 'Unknown Item',
          itemName: inventoryItem.item?.itemName || 'Unknown Item',
          category: category,
          description: inventoryItem.item?.description || '',
          quantity: inventoryItem.totalQuantity || 0,
          unit: inventoryItem.item?.unit || 'units',
          manufacturer: inventoryItem.item?.manufacturer || '',
          expiryDate: inventoryItem.item?.expiryDate || '',
          storageInstructions: inventoryItem.item?.storageInstructions || '',
          minThreshold: 10,
          maxThreshold: 50,
          updatedAt: inventoryItem.updatedAt,
          createdAt: inventoryItem.item?.createdAt || inventoryItem.updatedAt
        };
      });
      
      setSearchResults(transformedItems);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error in live search:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      // Map frontend category back to backend category
      let backendCategory = formData.category;
      if (formData.category === 'medications') {
        backendCategory = 'Medicine';
      } else if (formData.category === 'equipment') {
        backendCategory = 'Equipment';
      } else {
        backendCategory = 'Consumables';
      }
      
      // Create a new medical item first, then add it to inventory
      // The API expects a two-step process: 
      // 1. Create medical item
      // 2. Add the medical item to inventory with quantity
      const itemData = {
        itemName: formData.name,
        category: backendCategory,
        unit: formData.unit,
        description: formData.description || '',
        manufacturer: formData.manufacturer || '',
        expiryDate: formData.expiryDate || null,
        storageInstructions: formData.storageInstructions || '',
        totalQuantity: formData.quantity
      };
      
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
      // Map frontend category back to backend category
      let backendCategory = formData.category;
      if (formData.category === 'medications') {
        backendCategory = 'Medicine';
      } else if (formData.category === 'equipment') {
        backendCategory = 'Equipment';
      } else {
        backendCategory = 'Consumables';
      }

      // First update the medical item details
      await inventoryAPI.updateMedicalItem(selectedItem.item.itemId, {
        name: formData.name,
        category: backendCategory,
        unit: formData.unit,
        description: formData.description || '',
        manufacturer: formData.manufacturer || '',
        expiryDate: formData.expiryDate || null,
        storageInstructions: formData.storageInstructions || '',
      });

      // Then update the inventory quantity if it has changed
      if (formData.quantity !== selectedItem.totalQuantity) {
        const inventoryPayload = {
          itemId: selectedItem.item.itemId,
          totalQuantity: formData.quantity
        };
        await inventoryAPI.updateInventoryItem(selectedItem.inventoryId, inventoryPayload);
      }

      setShowEditModal(false);
      resetForm();
      await fetchInventory(); // Refresh the inventory data
      
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to update item. ';
      
      if (error.message.includes('403') || error.message.includes('Access denied')) {
        errorMessage += 'You do not have permission to update inventory items. Please check with your administrator.';
      } else if (error.message.includes('404')) {
        errorMessage += 'The item was not found. It may have been deleted.';
      } else if (error.message.includes('Network Error')) {
        errorMessage += 'Network connection issue. Please check your internet connection.';
      } else {
        errorMessage += error.message || 'Please try again or contact support.';
      }
      
      alert(errorMessage);
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
      manufacturer: '',
      expiryDate: '',
      storageInstructions: '',
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
      manufacturer: item.manufacturer || '',
      expiryDate: item.expiryDate ? formatDateForInput(item.expiryDate) : '',
      storageInstructions: item.storageInstructions || '',
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
          <div className="relative flex-grow max-w-md" ref={searchRef}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleLiveSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-12 flex items-center pr-2 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSearchTerm('');
                  setShowSearchResults(false);
                  setSearchResults([]);
                  fetchInventory();
                }}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 px-3 mr-1 my-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <span className="text-sm font-medium">Search</span>
            </button>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Search Results</h3>
                    <span className="text-xs text-gray-500">{searchResults.length} items found</span>
                  </div>
                </div>
                <div className="py-2">
                  {searchResults.map((item) => {
                    const stockInfo = inventoryAPI.getStockStatus(item.quantity);
                    return (
                      <div
                        key={item.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                        onClick={() => {
                          openEditModal(item);
                          setShowSearchResults(false);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.name || item.itemName}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.description || 'No description available'}
                            </p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                ${item.category === 'medications' ? 'bg-blue-100 text-blue-800' : 
                                  item.category === 'equipment' ? 'bg-green-100 text-green-800' : 
                                  'bg-purple-100 text-purple-800'}`}>
                                {item.category}
                              </span>
                              {item.manufacturer && (
                                <span className="text-xs text-gray-500">
                                  {item.manufacturer}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-3 text-right">
                            <div className="flex items-center justify-end mb-1">
                              <span className="text-sm font-semibold text-gray-900">
                                {item.quantity}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">
                                {item.unit || 'units'}
                              </span>
                            </div>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                              ${stockInfo === 'good' ? 'bg-green-100 text-green-800' : 
                                stockInfo === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {stockInfo === 'good' ? 'In Stock' : stockInfo === 'moderate' ? 'Low Stock' : 'Out of Stock'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => {
                      handleSearch();
                      setShowSearchResults(false);
                    }}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all {searchResults.length} results →
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative add-item-dropdown" ref={dropdownRef}>
            <button 
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              onKeyDown={handleDropdownKeyDown}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-all focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:outline-none"
              aria-expanded={showAddDropdown}
              aria-haspopup="true"
              id="add-item-button"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Item</span>
              <svg 
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${showAddDropdown ? 'rotate-180' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showAddDropdown && (
              <div 
                className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg z-20 border border-gray-200 animate-fade-in transform origin-top-right"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="add-item-button"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      setFormData({
                        name: '',
                        category: 'medications',
                        quantity: 0,
                        unit: '',
                        description: '',
                        manufacturer: '',
                        expiryDate: '',
                        storageInstructions: '',
                        minThreshold: 10,
                        maxThreshold: 50,
                      });
                      setShowAddModal(true);
                      setShowAddDropdown(false);
                    }}
                    onKeyDown={handleDropdownKeyDown}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-t-xl transition-colors focus:outline-none focus:bg-blue-50"
                    role="menuitem"
                    tabIndex={showAddDropdown ? 0 : -1}
                  >
                    <span className="flex items-center">
                      <PlusIcon className="h-4 w-4 mr-2 text-blue-600" />
                      <div>
                        <span className="font-medium">Create New Item</span>
                        <p className="text-xs text-gray-500 mt-1">Add a completely new item to the inventory</p>
                      </div>
                    </span>
                  </button>
                  
                  <div className="border-t border-gray-100"></div>
                  
                  <button
                    onClick={() => {
                      setShowExistingItemsModal(true);
                      setShowAddDropdown(false);
                    }}
                    onKeyDown={handleDropdownKeyDown}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-b-xl transition-colors focus:outline-none focus:bg-blue-50"
                    role="menuitem"
                    tabIndex={showAddDropdown ? 0 : -1}
                  >
                    <span className="flex items-center">
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2 text-green-600" />
                      <div>
                        <span className="font-medium">Use Existing Medical Item</span>
                        <p className="text-xs text-gray-500 mt-1">Select from available medical catalog</p>
                      </div>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!selectedCategory ? (
        <div className="space-y-6">
          {/* Search Status */}
          {searchTerm.trim() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-blue-800">
                    Search results for "{searchTerm}"
                  </h3>
                  <p className="text-sm text-blue-600">
                    Found {totalItems} {totalItems === 1 ? 'item' : 'items'} across all categories
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    fetchInventory();
                  }}
                  className="px-3 py-1 bg-white text-blue-700 border border-blue-300 rounded-md text-sm hover:bg-blue-100"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}
          
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
            {Object.entries(inventoryData).map(([category, items]) => {
              if (items.length === 0 && !searchTerm.trim()) return null;
              
              return (
                <div key={category} className="space-y-4">
                  {/* Category Header Card */}
                  <div 
                    onClick={() => setSelectedCategory(category)}
                    className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 ${getCategoryColor(category)} hover:border-opacity-80`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                        <h3 className="text-xl font-semibold text-gray-800 capitalize">{category}</h3>
                      </div>
                      <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
                        {items.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Low Stock:</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          items.filter(item => {
                            const status = item.status || inventoryAPI.getStockStatus(item.quantity);
                            return status === 'low';
                          }).length > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {items.filter(item => {
                            const status = item.status || inventoryAPI.getStockStatus(item.quantity);
                            return status === 'low';
                          }).length} items
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="text-xs text-gray-500 mb-1">Recent items:</div>
                        {searchTerm.trim() ? (
                          <div className="space-y-1">
                            {items.slice(0, 4).map(item => (
                              <div key={item.id} className="text-sm flex items-center">
                                {item.highlightMatch && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1.5"></span>
                                )}
                                <span className={item.highlightMatch ? 'font-medium' : ''}>
                                  {item.name || item.itemName}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm">
                            {items.slice(0, 3).map(item => item.name || item.itemName).join(', ')}
                            {items.length > 3 ? '...' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center w-full px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm font-medium transition-colors">
                      View all items →
                    </div>
                  </div>

                  {/* Items List - Show when searching */}
                  {searchTerm.trim() && items.length > 0 && (
                    <div className="bg-white rounded-lg shadow border">
                      <div className="p-4 border-b border-gray-200">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <span className="text-lg mr-2">{getCategoryIcon(category)}</span>
                          {category.charAt(0).toUpperCase() + category.slice(1)} Items
                          <span className="ml-2 text-sm text-gray-500">({items.length})</span>
                        </h4>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {items.map((item) => {
                          const stockStatus = inventoryAPI.getStockStatus(item.quantity);
                          return (
                            <div
                              key={item.id}
                              className="p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center">
                                    {item.highlightMatch && (
                                      <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                                    )}
                                    <h5 className="text-sm font-medium text-gray-900 truncate">
                                      {item.name || item.itemName}
                                    </h5>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1 truncate">
                                    {item.description || 'No description available'}
                                  </p>
                                  <div className="flex items-center mt-2 space-x-2">
                                    {item.manufacturer && (
                                      <span className="text-xs text-gray-500">
                                        {item.manufacturer}
                                      </span>
                                    )}
                                    {item.expiryDate && (
                                      <span className="text-xs text-gray-500">
                                        • Exp: {new Date(item.expiryDate).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-3 text-right">
                                  <div className="flex items-center justify-end mb-1">
                                    <span className="text-sm font-semibold text-gray-900">
                                      {item.quantity}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                      {item.unit || 'units'}
                                    </span>
                                  </div>
                                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                    ${stockStatus === 'good' ? 'bg-green-100 text-green-800' : 
                                      stockStatus === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'}`}>
                                    {stockStatus === 'good' ? 'In Stock' : 
                                     stockStatus === 'moderate' ? 'Low Stock' : 'Out of Stock'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {items.length > 5 && (
                        <div className="p-3 border-t border-gray-100 bg-gray-50">
                          <button
                            onClick={() => setSelectedCategory(category)}
                            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View all {items.length} {category} items →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Category Detail View
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryData[selectedCategory]?.map((item) => {
              const status = item.status || inventoryAPI.getStockStatus(item.quantity);
              return (
                <div key={item.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${item.highlightMatch ? 'bg-yellow-50 border-yellow-200' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {item.highlightMatch && (
                        <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2" title="Search match"></span>
                      )}
                      <h4 className="font-medium text-gray-800">{item.name || item.itemName}</h4>
                    </div>
                    <span className={`text-sm font-semibold ${getStatusColor(item)}`}>
                      {item.quantity} {item.unit || 'units'}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1 mb-3">
                    <span className="text-sm text-gray-500">
                      Stock Level: <span className={getStatusColor(item)}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </span>
                    
                    {item.manufacturer && (
                      <span className="text-xs text-gray-500">Manufacturer: {item.manufacturer}</span>
                    )}
                    
                    {item.expiryDate && (
                      <span className="text-xs text-gray-500">
                        Expires: {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                    
                    {item.storageInstructions && (
                      <span className="text-xs text-gray-500 line-clamp-1">
                        Storage: {item.storageInstructions}
                      </span>
                    )}
                    
                    {item.description && (
                      <span className="text-xs text-gray-500 line-clamp-1 mt-1">{item.description}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., MediCorp, PharmaCo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Storage Instructions</label>
                  <textarea
                    value={formData.storageInstructions}
                    onChange={(e) => setFormData({...formData, storageInstructions: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    placeholder="e.g., Store in a cool, dry place"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    placeholder="Item description (optional)"
                  ></textarea>
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., MediCorp, PharmaCo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Storage Instructions</label>
                  <textarea
                    value={formData.storageInstructions}
                    onChange={(e) => setFormData({...formData, storageInstructions: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    placeholder="e.g., Store in a cool, dry place"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    placeholder="Item description (optional)"
                  ></textarea>
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
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
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Medical Items Modal */}
      {showExistingItemsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto my-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {showAddQuantityForm && (
                  <button
                    onClick={() => {
                      setShowAddQuantityForm(false);
                      setSelectedMedicalItem(null);
                    }}
                    className="mr-3 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="Go back to item selection"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                )}
                <h2 className="text-xl font-bold">
                  {showAddQuantityForm 
                    ? `Add "${selectedMedicalItem?.itemName}" to Inventory` 
                    : "Select Existing Medical Item"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowExistingItemsModal(false);
                  setShowAddQuantityForm(false);
                  setSelectedMedicalItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {showAddQuantityForm ? (
              <div className="py-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <h3 className="font-medium text-blue-800">Item Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-7">
                    <div>
                      <p><span className="font-medium">Name:</span> {selectedMedicalItem?.itemName}</p>
                      <p><span className="font-medium">Category:</span> {selectedMedicalItem?.category}</p>
                      <p><span className="font-medium">Unit:</span> {selectedMedicalItem?.unit || 'units'}</p>
                    </div>
                    <div>
                      {selectedMedicalItem?.manufacturer && (
                        <p><span className="font-medium">Manufacturer:</span> {selectedMedicalItem.manufacturer}</p>
                      )}
                      {selectedMedicalItem?.expiryDate && (
                        <p><span className="font-medium">Expiry Date:</span> {new Date(selectedMedicalItem.expiryDate).toLocaleDateString()}</p>
                      )}
                      {selectedMedicalItem?.storageInstructions && (
                        <p><span className="font-medium">Storage:</span> {selectedMedicalItem.storageInstructions}</p>
                      )}
                    </div>
                    {selectedMedicalItem?.description && (
                      <p className="col-span-2"><span className="font-medium">Description:</span> {selectedMedicalItem.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                      autoFocus
                    />
                    <span className="ml-2 text-gray-500">{selectedMedicalItem?.unit || 'units'}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddQuantityForm(false);
                      setSelectedMedicalItem(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddExistingItem}
                    disabled={formData.quantity <= 0}
                    className={`px-4 py-2 rounded-md text-white flex items-center ${
                      formData.quantity <= 0 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Add to Inventory
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Search Box */}
                <div className="mb-4 flex">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search medical items by name or description..."
                      value={medicalItemSearchTerm}
                      onChange={(e) => setMedicalItemSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Medical Items List */}
                <div className="border rounded-xl overflow-hidden">
                  {loadingMedicalItems ? (
                    <div className="p-4 flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading medical items...</span>
                    </div>
                  ) : filteredMedicalItems.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      {medicalItemSearchTerm ? 
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                          </div>
                          <p>No matching items found for "{medicalItemSearchTerm}"</p>
                          <p className="text-sm">Try a different search term or check spelling</p>
                        </div>
                        : 
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                            </svg>
                          </div>
                          <p>No medical items available in the catalog</p>
                          <p className="text-sm">Create new items using the "Create New Item" option</p>
                        </div>
                      }
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredMedicalItems.map((item) => (
                            <tr key={item.itemId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.unit || 'units'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => selectItemToAdd(item)}
                                  className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors flex items-center"
                                >
                                  <span className="mr-1">Select</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
