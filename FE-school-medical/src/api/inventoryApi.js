import axiosInstance from './axiosInstance';

// Helper function to check authentication
const checkAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token || !role) {
    console.warn('No authentication found, redirecting to login');
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Authentication required');
  }
  
  return { token, role };
};

export const inventoryAPI = {
  // Get all inventory items
  getAllInventory: async () => {
    try {
      const { token, role } = checkAuth();
      
      const response = await axiosInstance.get('/api/inventory');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error in getAllInventory:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return [];
    }
  },

  // Add new inventory item (creates medical item first, then adds to inventory)
  addInventoryItem: async (itemData) => {
    try {
      const { token, role } = checkAuth();
      
      // Check if user has permission to add inventory (backend expects NURSE and PRINCIPAL, also allowing Admin)
      if (!['Nurse', 'Principal', 'Admin'].includes(role)) {
        throw new Error(`Role ${role} is not authorized to add inventory items. Allowed: Nurse, Principal, Admin`);
      }
      
      // Step 1: Create the medical item first
      const medicalItemRequest = {
        itemName: itemData.itemName,
        category: itemData.category,
        description: itemData.description || '',
        manufacturer: itemData.manufacturer || '',
        expiryDate: itemData.expiryDate || null,
        storageInstructions: itemData.storageInstructions || '',
        unit: itemData.unit || 'units'
      };
      
      const medicalItemResponse = await axiosInstance.post('/api/medical-items', medicalItemRequest);
      
      // Step 2: Add to inventory with the created item ID
      const inventoryRequest = {
        itemId: medicalItemResponse.data.itemId, // This is correct, the API expects itemId
        totalQuantity: itemData.totalQuantity || 0
      };
      
      const inventoryResponse = await axiosInstance.post('/api/inventory', inventoryRequest);
      
      return inventoryResponse.data;
    } catch (error) {
      console.error('Error in addInventoryItem:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Update inventory item (updates both medical item details and inventory quantity)
  updateInventoryItem: async (inventoryId, itemData) => {
    try {
      const { token, role } = checkAuth();
      
      // Check if user has permission to update inventory (allowing Nurse, Principal, and Admin)
      if (!['Nurse', 'Principal', 'Admin'].includes(role)) {
        throw new Error(`Only Nurse, Principal, Admin roles are authorized to update inventory items. Your role: ${role}`);
      }
      
      // Get current inventory to find the itemId
      const currentInventory = await axiosInstance.get(`/api/inventory`);
      const inventoryItem = currentInventory.data.find(inv => inv.inventoryId === inventoryId);
      
      if (!inventoryItem) {
        throw new Error(`Inventory item with ID ${inventoryId} not found`);
      }
      
      const itemId = inventoryItem.item.itemId;
      
      // Step 1: Update medical item details
      const medicalItemRequest = {
        itemName: itemData.itemName,
        category: itemData.category,
        description: itemData.description || '',
        manufacturer: itemData.manufacturer || '',
        expiryDate: itemData.expiryDate || null,
        storageInstructions: itemData.storageInstructions || '',
        unit: itemData.unit || 'units'
      };
      
      await axiosInstance.put(`/api/medical-items/${itemId}`, medicalItemRequest);
      
      // Step 2: Update inventory quantity
      const inventoryRequest = {
        itemId: itemId,
        totalQuantity: itemData.totalQuantity || 0
      };
      
      const inventoryResponse = await axiosInstance.put(`/api/inventory/${inventoryId}`, inventoryRequest);
      
      return inventoryResponse.data;
    } catch (error) {
      console.error('Error in updateInventoryItem:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Delete inventory item (NURSE and PRINCIPAL only)
  deleteInventoryItem: async (id) => {
    try {
      const { token, role } = checkAuth();
      
      // Check if user has permission to delete inventory (allowing Nurse, Principal, and Admin)
      if (!['Nurse', 'Principal', 'Admin'].includes(role)) {
        throw new Error(`Role ${role} is not authorized to delete inventory items. Allowed: Nurse, Principal, Admin`);
      }
      
      const response = await axiosInstance.delete(`/api/inventory/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteInventoryItem:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Search inventory by keyword
  searchInventory: async (keyword) => {
    try {
      const { token, role } = checkAuth();
      
      const response = await axiosInstance.get(`/api/inventory/search?keyword=${encodeURIComponent(keyword)}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error in searchInventory:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return [];
    }
  },

  // Helper function to categorize inventory items
  categorizeInventory: (inventoryItems) => {
    const categories = {
      medications: [],
      equipment: [],
      consumables: []
    };

    inventoryItems.forEach(item => {
      const category = item.category ? item.category.toLowerCase() : 'consumables';
      if (categories[category]) {
        categories[category].push(item);
      } else {
        // Default to consumables if category is unknown
        categories.consumables.push(item);
      }
    });

    return categories;
  },

  // Helper function to determine stock status based on quantity
  getStockStatus: (quantity, minThreshold = 10, maxThreshold = 50) => {
    if (quantity <= minThreshold) {
      return 'low';
    } else if (quantity <= maxThreshold) {
      return 'moderate';
    } else {
      return 'good';
    }
  },

  // Get all available medical items from the backend
  getMedicalItems: async () => {
    try {
      const { token, role } = checkAuth();
      
      const response = await axiosInstance.get('/api/medical-items');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error in getMedicalItems:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return [];
    }
  },

  // Add existing medical item to inventory
  addExistingItemToInventory: async (itemId, quantity) => {
    try {
      const { token, role } = checkAuth();
      
      // Check if user has permission
      if (!['Nurse', 'Principal', 'Admin'].includes(role)) {
        throw new Error(`Role ${role} is not authorized to add inventory items. Allowed: Nurse, Principal, Admin`);
      }
      
      const inventoryRequest = {
        itemId: itemId,
        totalQuantity: quantity || 0
      };
      
      const inventoryResponse = await axiosInstance.post('/api/inventory', inventoryRequest);
      return inventoryResponse.data;
    } catch (error) {
      console.error('Error in addExistingItemToInventory:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  }
};

export default inventoryAPI;
