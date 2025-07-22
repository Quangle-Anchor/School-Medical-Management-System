import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  ClockIcon,
  ArchiveBoxIcon
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
  const [showUpdateItemsModal, setShowUpdateItemsModal] = useState(false);
  const [showUpdateQuantityForm, setShowUpdateQuantityForm] = useState(false);
  const [selectedUpdateItem, setSelectedUpdateItem] = useState(null);
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

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  // Toast functions
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search results when clicking outside
      if (showSearchResults && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);

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
      showToast('Failed to fetch medical items. Please try again later.', 'error');
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
        showToast('Please select an item first', 'warning');
        return;
    }

    if (!formData.quantity || formData.quantity <= 0) {
        showToast('Please enter a valid quantity', 'warning');
        return;
    }      // Show loading state
      const quantity = formData.quantity; // Store quantity for success message
      
      await inventoryAPI.addExistingItemToInventory(selectedMedicalItem.itemId, formData.quantity);
      
      // Close modals and reset state
      setShowExistingItemsModal(false);
      setSelectedMedicalItem(null);
      setShowAddQuantityForm(false);
      resetForm();
      fetchInventory();
      
      // Show success notification
      showToast(`Successfully added ${quantity} ${selectedMedicalItem.unit || 'units'} of ${selectedMedicalItem.itemName} to inventory`, 'success');
    } catch (error) {
      console.error('Error adding existing item to inventory:', error);
      showToast(`Failed to add item: ${error.message || 'Please check your permissions.'}`, 'error');
    }
  };
  
  // Select an item to export (take out) quantity
  const selectItemToUpdate = (item) => {
    setSelectedUpdateItem(item);
    setShowUpdateQuantityForm(true);
    // Reset quantity to 1 for export (take out) operation
    setFormData(prevData => ({
      ...prevData,
      quantity: 1
    }));
  };
  
  // Handle exporting (taking out) inventory item quantity
  const handleUpdateInventoryItem = async () => {
    try {
      if (!selectedUpdateItem) {
        showToast('Please select an item first', 'warning');
        return;
      }
      
      if (!formData.quantity || formData.quantity <= 0) {
        showToast('Please enter a valid quantity to export', 'warning');
        return;
      }
      
      if (formData.quantity > selectedUpdateItem.quantity) {
        showToast(`Cannot export ${formData.quantity} ${selectedUpdateItem.unit || 'units'}. Only ${selectedUpdateItem.quantity} ${selectedUpdateItem.unit || 'units'} available in stock.`, 'warning');
        return;
      }      
      // Show loading state
      const exportQuantity = formData.quantity; // Store quantity for success message
      
      // Send the quantity to subtract to backend (backend will handle the subtraction)
      const updateData = {
        totalQuantity: exportQuantity
      };
      
      await inventoryAPI.updateInventoryItem(selectedUpdateItem.id, updateData);
      
      // Close modals and reset state
      setShowUpdateItemsModal(false);
      setSelectedUpdateItem(null);
      setShowUpdateQuantityForm(false);
      resetForm();
      fetchInventory();
      
      // Show success notification
      showToast(`Successfully exported ${exportQuantity} ${selectedUpdateItem.unit || 'units'} of ${selectedUpdateItem.name || selectedUpdateItem.itemName}`, 'success');
    } catch (error) {
      console.error('Error exporting inventory item:', error);
      showToast(`Failed to export item: ${error.message || 'Please check your permissions.'}`, 'error');
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
        showToast(`No items found matching "${searchTerm}"`, 'info');
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
      
      // Create only the medical item (no inventory quantity)
      const itemData = {
        itemName: formData.name,
        category: backendCategory,
        unit: formData.unit,
        description: formData.description || '',
        manufacturer: formData.manufacturer || '',
        expiryDate: formData.expiryDate || null,
        storageInstructions: formData.storageInstructions || ''
      };
      
      await inventoryAPI.addMedicalItem(itemData);
      setShowAddModal(false);
      resetForm();
      // No need to fetch inventory since we're only creating the medical item
      showToast(`Successfully created medical item: ${formData.name}`, 'success');
    } catch (error) {
      console.error('Error adding item:', error);
      showToast(`Failed to add item: ${error.message || 'Please check your permissions.'}`, 'error');
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
      
      showToast('Item updated successfully!', 'success');
    } catch (error) {

      
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
      
      showToast(errorMessage, 'error');
    }
  };

  const handleDeleteItem = async () => {
    try {
      await inventoryAPI.deleteInventoryItem(selectedItem.id);
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchInventory();
      showToast('Item deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast('Failed to delete item. Please check your permissions.', 'error');
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 transform transition-all duration-300 ease-in-out ${
              toast.type === 'success' 
                ? 'border-l-4 border-green-400' 
                : toast.type === 'error' 
                ? 'border-l-4 border-red-400'
                : toast.type === 'warning'
                ? 'border-l-4 border-yellow-400'
                : 'border-l-4 border-blue-400'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === 'success' && (
                    <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                  )}
                  {toast.type === 'error' && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  )}
                  {toast.type === 'warning' && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  )}
                  {toast.type === 'info' && (
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 20 20">
                      <path fill="currentColor" fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {toast.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => removeToast(toast.id)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">MediStock</h1>
            <p className="text-gray-600">Medical Inventory Management System</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Import Button - Add Existing Item */}
            <button 
              onClick={() => setShowExistingItemsModal(true)}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              Import
            </button>
            
            {/* Export Button - Update Existing Items */}
            <button 
              onClick={() => setShowUpdateItemsModal(true)}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export
            </button>
            
            {/* Add Item Button - Create New Item Only */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-all focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:outline-none"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-3xl font-bold text-red-600">{lowStockItems}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-3xl font-bold text-orange-600">
                  {allItems.filter(item => {
                    const expiryDate = item.item?.expiryDate || item.expiryDate;
                    if (!expiryDate) return false;
                    return new Date(expiryDate) < new Date();
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                !selectedCategory
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                All Items
              </div>
            </button>
            
            <button
              onClick={() => setSelectedCategory('medications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedCategory === 'medications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                💊 Medications
              </div>
            </button>
            
            <button
              onClick={() => setSelectedCategory('equipment')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedCategory === 'equipment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                🔧 Equipment
              </div>
            </button>
            
            <button
              onClick={() => setSelectedCategory('consumables')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedCategory === 'consumables'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                📦 Consumables
              </div>
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative max-w-md" ref={searchRef}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => handleLiveSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSearchTerm('');
                  setShowSearchResults(false);
                  setSearchResults([]);
                  fetchInventory();
                }}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
            
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
                    const stockInfo = inventoryAPI.getStockStatus(item.totalQuantity || item.quantity);
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
                              {item.item?.itemName || item.name || item.itemName}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.item?.description || item.description || 'No description available'}
                            </p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                ${(item.item?.category || item.category) === 'medications' ? 'bg-blue-100 text-blue-800' : 
                                  (item.item?.category || item.category) === 'equipment' ? 'bg-green-100 text-green-800' : 
                                  'bg-purple-100 text-purple-800'}`}>
                                {item.item?.category || item.category}
                              </span>
                              {(item.item?.manufacturer || item.manufacturer) && (
                                <span className="text-xs text-gray-500">
                                  {item.item?.manufacturer || item.manufacturer}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-3 text-right">
                            <div className="flex items-center justify-end mb-1">
                              <span className="text-sm font-semibold text-gray-900">
                                {item.totalQuantity || item.quantity}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">
                                {item.item?.unit || item.unit || 'units'}
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
        </div>
      </div>

      {/* Search Status */}
      {searchTerm.trim() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-blue-800">
                Search results for "{searchTerm}"
              </h3>
              <p className="text-sm text-blue-600">
                Found {totalItems} {totalItems === 1 ? 'item' : 'items'} {selectedCategory ? `in ${selectedCategory}` : 'across all categories'}
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

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Table Header with Actions */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {selectedCategory ? 
                  `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Inventory` : 
                  'All Inventory Items'
                }
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {(() => {
                  const currentItems = selectedCategory 
                    ? inventoryData[selectedCategory] || []
                    : allItems;
                  return `${currentItems.length} items total`;
                })()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowExistingItemsModal(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowUpTrayIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Import
              </button>
              <button
                onClick={() => setShowUpdateItemsModal(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <DocumentArrowDownIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Add Item
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(() => {
                  const currentItems = selectedCategory 
                    ? inventoryData[selectedCategory] || []
                    : allItems;
                  
                  if (currentItems.length === 0) {
                    return (
                      <tr>
                        <td colSpan="9" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              {searchTerm.trim() ? 'No matching items found' : 'No inventory items'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {searchTerm.trim() ? 
                                `No items match "${searchTerm}". Try adjusting your search terms.` :
                                selectedCategory ? 
                                  `No items in ${selectedCategory} category yet.` :
                                  'No items in your inventory yet.'
                              }
                            </p>
                            {!searchTerm.trim() && (
                              <div className="mt-6">
                                <button
                                  onClick={() => setShowAddModal(true)}
                                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                  Add your first item
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  
                  return currentItems.map((item) => {
                    const status = item.status || inventoryAPI.getStockStatus(item.totalQuantity || item.quantity);
                    const isExpired = (item.item?.expiryDate || item.expiryDate) && new Date(item.item?.expiryDate || item.expiryDate) < new Date();
                    
                    return (
                    <tr key={item.inventoryId} className={`hover:bg-gray-50 ${item.highlightMatch ? 'bg-yellow-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.highlightMatch && (
                            <span className="w-2 h-2 rounded-full bg-yellow-400 mr-3"></span>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.item?.itemName || item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.item?.manufacturer || item.manufacturer}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.item?.category || item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.totalQuantity || item.quantity} {item.item?.unit || item.unit || 'units'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status === 'good' ? 'bg-green-100 text-green-800' :
                          status === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {status === 'good' ? 'In Stock' :
                           status === 'moderate' ? 'Low Stock' :
                           'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(item.item?.expiryDate || item.expiryDate) ? (
                          <span className={isExpired ? 'text-red-600 font-medium' : ''}>
                            {new Date(item.item?.expiryDate || item.expiryDate).toLocaleDateString()}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.item?.unit || item.unit || 'units'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(item)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
              </tbody>
            </table>
          </div>
        </div>

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
              Are you sure you want to delete "{selectedItem?.item?.itemName || selectedItem?.name || selectedItem?.itemName}"? This action cannot be undone.
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

      {/* Update Items Modal */}
      {showUpdateItemsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto my-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {showUpdateQuantityForm && (
                  <button
                    onClick={() => {
                      setShowUpdateQuantityForm(false);
                      setSelectedUpdateItem(null);
                    }}
                    className="mr-3 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="Go back to item selection"
                  >
                    <svg xmlns="http://www.w3z  .org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                )}
                <h2 className="text-xl font-bold">
                  {showUpdateQuantityForm 
                    ? `Export "${selectedUpdateItem?.item?.itemName || selectedUpdateItem?.name || selectedUpdateItem?.itemName}"` 
                    : "Select Item to Export"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowUpdateItemsModal(false);
                  setShowUpdateQuantityForm(false);
                  setSelectedUpdateItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {showUpdateQuantityForm ? (
              <div className="py-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <h3 className="font-medium text-blue-800">Current Item Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-7">
                    <div>
                      <p><span className="font-medium">Name:</span> {selectedUpdateItem?.item?.itemName || selectedUpdateItem?.name || selectedUpdateItem?.itemName}</p>
                      <p><span className="font-medium">Category:</span> {selectedUpdateItem?.item?.category || selectedUpdateItem?.category}</p>
                    </div>
                    <div>
                      {(selectedUpdateItem?.item?.manufacturer || selectedUpdateItem?.manufacturer) && (
                        <p><span className="font-medium">Manufacturer:</span> {selectedUpdateItem?.item?.manufacturer || selectedUpdateItem.manufacturer}</p>
                      )}
                      {(selectedUpdateItem?.item?.expiryDate || selectedUpdateItem?.expiryDate) && (
                        <p><span className="font-medium">Expiry Date:</span> {new Date(selectedUpdateItem?.item?.expiryDate || selectedUpdateItem.expiryDate).toLocaleDateString()}</p>
                      )}
                      {(selectedUpdateItem?.item?.unit || selectedUpdateItem?.unit) && (
                        <p><span className="font-medium">Unit:</span> {selectedUpdateItem?.item?.unit || selectedUpdateItem.unit}</p>
                      )}
                    </div>
                    {(selectedUpdateItem?.item?.description || selectedUpdateItem?.description) && (
                      <p className="col-span-2"><span className="font-medium">Description:</span> {selectedUpdateItem?.item?.description || selectedUpdateItem.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Export</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max={selectedUpdateItem?.totalQuantity || selectedUpdateItem?.quantity}
                      required
                      autoFocus
                    />
                    <span className="ml-2 text-gray-500">{selectedUpdateItem?.item?.unit || selectedUpdateItem?.unit || 'units'}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Available: {selectedUpdateItem?.totalQuantity || selectedUpdateItem?.quantity} {selectedUpdateItem?.item?.unit || selectedUpdateItem?.unit || 'units'}
                  </p>
                </div>
                
                <div className="flex space-x-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateQuantityForm(false);
                      setSelectedUpdateItem(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateInventoryItem}
                    className="px-4 py-2 rounded-md text-white flex items-center bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Export Items
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
                      placeholder="Search inventory items to update..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="border rounded-xl overflow-hidden">
                  {allItems.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <ArchiveBoxIcon className="w-12 h-12 text-gray-300" />
                        </div>
                        <p>No inventory items to update</p>
                        <p className="text-sm">Add some items first before trying to update them</p>
                      </div>
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
                              Current Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allItems
                            .filter(item => 
                              !searchTerm.trim() || 
                              (item.item?.itemName || item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (item.item?.description || item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (item.item?.category || item.category || '').toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((item) => {
                              const status = item.status || inventoryAPI.getStockStatus(item.totalQuantity || item.quantity);
                              return (
                                <tr key={item.inventoryId} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.item?.itemName || item.name}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.item?.description || item.description}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                      {item.item?.category || item.category}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.totalQuantity || item.quantity} {item.item?.unit || item.unit || 'units'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      status === 'good' ? 'bg-green-100 text-green-800' :
                                      status === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {status === 'good' ? 'In Stock' :
                                       status === 'moderate' ? 'Low Stock' :
                                       'Out of Stock'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={() => selectItemToUpdate(item)}
                                      className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors flex items-center"
                                    >
                                      <span className="mr-1">Update</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
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
