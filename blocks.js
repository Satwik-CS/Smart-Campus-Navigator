function populateBuildingDropdown() {
    const buildingSelect = document.getElementById('building_id');
    if (!buildingSelect) return;
    
    // Clear existing options except "All Buildings"
    while (buildingSelect.options.length > 1) {
        buildingSelect.remove(1);
    }
    
    // Get buildings from data store
    const buildings = window.DataStore.getItems('BUILDINGS');
    if (!buildings || buildings.length === 0) return;
    
    // Add building options
    buildings.forEach(building => {
        const option = document.createElement('option');
        option.value = building.id;
        option.textContent = building.name;
        buildingSelect.appendChild(option);
    });
}

// Add this call to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the clickable blocks
    initializeBlockSelection();
    
    // Populate building dropdown
    populateBuildingDropdown();
});