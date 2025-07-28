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

// Helper function to check if role has permission for inventory operations
const hasInventoryPermission = (role) => {
  // Normalize role to handle different case formats
  const normalizedRole = role?.toLowerCase();
  const allowedRoles = ['nurse', 'principal', 'admin'];
  
  return allowedRoles.includes(normalizedRole);
};

export const inventoryAPI = {
  // Get all inventory items
  getAllInventory: async () => {
    try {
      checkAuth();
      
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

  // Update an existing medical item
  updateMedicalItem: async (itemId, itemData) => {
    try {
      const { role } = checkAuth();
      
      if (!hasInventoryPermission(role)) {
        throw new Error('You do not have permission to update medical items');
      }

      const response = await axiosInstance.put(`/api/medical-items/${itemId}`, {
        itemName: itemData.name,
        category: itemData.category,
        description: itemData.description || '',
        manufacturer: itemData.manufacturer || '',
        expiryDate: itemData.expiryDate || null,
        storageInstructions: itemData.storageInstructions || '',
        unit: itemData.unit || 'units'
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Add new medical item only (does not add to inventory)
  addMedicalItem: async (itemData) => {
    try {
      const { role } = checkAuth();
      
      // Check if user has permission to add medical items
      if (!hasInventoryPermission(role)) {
        throw new Error(`Role ${role} is not authorized to add medical items. Allowed: Nurse, Principal, Admin`);
      }
      
      // Create the medical item
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
      return medicalItemResponse.data;
    } catch (error) {
      console.error('Error in addMedicalItem:', error);
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

  // Add new inventory item (creates medical item first, then adds to inventory)
  
  // Delete inventory item (NURSE and PRINCIPAL only)
  deleteInventoryItem: async (id) => {
    try {
      const { role } = checkAuth();
      
      // Check if user has permission to delete inventory
      if (!hasInventoryPermission(role)) {
        throw new Error(`Role ${role} is not authorized to delete inventory items. Allowed: Nurse, Principal, Admin`);
      }
      
      const response = await axiosInstance.delete(`/api/medical-items/${id}`);
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
      checkAuth();
      
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
      checkAuth();
      
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

  // Update existing inventory item
  updateInventoryItem: async (inventoryId, updateData) => {
    try {
      const { role } = checkAuth();
      
      // Check if user has permission
      if (!hasInventoryPermission(role)) {
        throw new Error(`Role ${role} is not authorized to update inventory items. Allowed: Nurse, Principal, Admin`);
      }
      
      const response = await axiosInstance.put(`/api/inventory/${inventoryId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error in updateInventoryItem:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Add existing medical item to inventory
  addExistingItemToInventory: async (itemId, quantity) => {
    try {
      const { role } = checkAuth();
      
      // Check if user has permission
      if (!hasInventoryPermission(role)) {
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
