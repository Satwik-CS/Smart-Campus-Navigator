// Data storage utilities for Campus Navigator

// Constants for localStorage keys
const STORAGE_KEYS = {
    BUILDINGS: 'campus_navigator_buildings',
    LOCATION_TYPES: 'campus_navigator_location_types',
    LOCATIONS: 'campus_navigator_locations',
    PATHS: 'campus_navigator_paths'
};

// Initialize data store with default empty arrays
function initializeDataStore() {
    if (!localStorage.getItem(STORAGE_KEYS.BUILDINGS)) {
        localStorage.setItem(STORAGE_KEYS.BUILDINGS, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.LOCATION_TYPES)) {
        localStorage.setItem(STORAGE_KEYS.LOCATION_TYPES, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.PATHS)) {
        localStorage.setItem(STORAGE_KEYS.PATHS, JSON.stringify([]));
    }
}

// Get all items of a particular type
function getItems(type) {
    const key = STORAGE_KEYS[type.toUpperCase()];
    if (!key) return null;
    
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Get a single item by ID
function getItemById(type, id) {
    const items = getItems(type);
    return items.find(item => item.id === id);
}

// Get items by field value
function getItemsByField(type, field, value) {
    const items = getItems(type);
    return items.filter(item => item[field] === value);
}

// Store items (replace all existing items)
function storeItems(type, items) {
    const key = STORAGE_KEYS[type.toUpperCase()];
    if (!key) return false;
    
    localStorage.setItem(key, JSON.stringify(items));
    return true;
}

// Add a single item (generates new ID)
function addItem(type, item) {
    const items = getItems(type);
    
    // Generate new ID (max existing ID + 1, or 1 if no items)
    const maxId = items.length > 0 ? Math.max(...items.map(i => i.id)) : 0;
    const newItem = { ...item, id: maxId + 1 };
    
    items.push(newItem);
    storeItems(type, items);
    return newItem;
}

// Clear all data
function clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.BUILDINGS);
    localStorage.removeItem(STORAGE_KEYS.LOCATION_TYPES);
    localStorage.removeItem(STORAGE_KEYS.LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.PATHS);
    initializeDataStore();
}

// Export the functions
window.DataStore = {
    initialize: initializeDataStore,
    getItems,
    getItemById,
    getItemsByField,
    storeItems,
    addItem,
    clearAllData
};

// Initialize the data store
initializeDataStore();