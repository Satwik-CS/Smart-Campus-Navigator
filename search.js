// Search functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    setupSearchBehavior();
    
    // If on search results page, parse and display query parameters
    if (window.location.pathname.includes('search_results.html')) {
        displaySearchResults();
    }
    
    // If on the home page, handle floor options
    if (document.getElementById('building_id')) {
        document.getElementById('building_id').addEventListener('change', function() {
            updateFloorOptions(this.value);
        });
    }
});

function setupSearchBehavior() {
    // Get the search form
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;
    
    // In a real application, this would submit to the backend
    // For this static version, we'll redirect with query parameters
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchTerm = document.getElementById('search_term').value;
        const buildingId = document.getElementById('building_id')?.value || 'all';
        const locationType = document.getElementById('location_type_id')?.value || 'all';
        const floor = document.getElementById('floor')?.value || 'all';
        
        // Build query string
        const params = new URLSearchParams();
        if (searchTerm) params.append('search_term', searchTerm);
        if (buildingId !== 'all') params.append('building_id', buildingId);
        if (locationType !== 'all') params.append('location_type_id', locationType);
        if (floor !== 'all') params.append('floor', floor);
        
        // Redirect to search results
        window.location.href = 'search_results.html?' + params.toString();
    });
}

function displaySearchResults() {
    // Get search parameters from URL
    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get('search_term') || '';
    const buildingId = params.get('building_id') || 'all';
    const locationType = params.get('location_type_id') || 'all';
    const floor = params.get('floor') || 'all';
    
    // Display search term
    const searchTermElement = document.getElementById('search-term');
    if (searchTermElement) {
        searchTermElement.textContent = searchTerm || 'All Locations';
    }
    
    // Populate search box with the search term
    const searchInput = document.getElementById('search_term');
    if (searchInput) {
        searchInput.value = searchTerm;
    }
    
    // Set filter values if they exist
    if (document.getElementById('building_filter')) {
        document.getElementById('building_filter').value = buildingId;
    }
    
    if (document.getElementById('type_filter')) {
        document.getElementById('type_filter').value = locationType;
    }
    
    if (document.getElementById('floor_filter')) {
        document.getElementById('floor_filter').value = floor;
    }
    
    // In a real application, this would load results from the backend
    // For this static version, we'll keep the sample results
    
    // Add filter functionality
    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newParams = new URLSearchParams();
            if (searchTerm) newParams.append('search_term', searchTerm);
            
            const newBuildingId = document.getElementById('building_filter').value;
            if (newBuildingId !== 'all') newParams.append('building_id', newBuildingId);
            
            const newLocationType = document.getElementById('type_filter').value;
            if (newLocationType !== 'all') newParams.append('location_type_id', newLocationType);
            
            const newFloor = document.getElementById('floor_filter').value;
            if (newFloor !== 'all') newParams.append('floor', newFloor);
            
            // Redirect with new filters
            window.location.href = 'search_results.html?' + newParams.toString();
        });
    }
    
    // Reset filters button
    const resetButton = document.getElementById('reset-filters');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            const newParams = new URLSearchParams();
            if (searchTerm) newParams.append('search_term', searchTerm);
            
            window.location.href = 'search_results.html?' + newParams.toString();
        });
    }
}

function updateFloorOptions(buildingId) {
    // This function would typically make an AJAX request to get floors
    // For this static version, we'll simulate it
    const floorSelect = document.getElementById('floor');
    if (!floorSelect) return;
    
    // Clear current options
    floorSelect.innerHTML = '<option value="all">All Floors</option>';
    
    // If "all buildings" is selected, no floors to show
    if (buildingId === 'all') return;
    
    // Simulate floors based on building
    let maxFloors = 4; // Default
    
    if (buildingId === '1') maxFloors = 4;  // A Block
    else if (buildingId === '2') maxFloors = 5;  // B Block
    else if (buildingId === '3') maxFloors = 3;  // C Block
    
    // Add floor options
    for (let i = 1; i <= maxFloors; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = getFloorLabel(i);
        floorSelect.appendChild(option);
    }
}

function getFloorLabel(floor) {
    if (floor === 1) return '1st Floor';
    else if (floor === 2) return '2nd Floor';
    else if (floor === 3) return '3rd Floor';
    else return `${floor}th Floor`;
}