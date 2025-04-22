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
    
    // Get data from the data store
    const locations = window.DataStore.getItems('LOCATIONS');
    
    // Filter data based on search parameters
    let results = [...locations];
    
    // Filter by building if specified
    if (buildingId !== 'all') {
        results = results.filter(item => item.building_id === parseInt(buildingId));
    }
    
    // Filter by location type if specified
    if (locationType !== 'all') {
        results = results.filter(item => item.type_id === parseInt(locationType));
    }
    
    // Filter by floor if specified
    if (floor !== 'all') {
        results = results.filter(item => item.floor === parseInt(floor));
    }
    
    // Filter by search term if provided
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(item => 
            item.name.toLowerCase().includes(term) || 
            item.room_number.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term) ||
            item.building_name.toLowerCase().includes(term)
        );
    }
    
    // Display results
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                No locations found matching your search criteria. Please try different filters.
            </div>
        `;
    } else {
        results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item mb-4 p-3 border rounded';
            resultItem.innerHTML = `
                <h3 class="result-title"><a href="location_details.html?id=${item.id}">${item.name}</a></h3>
                <div class="result-details">
                    <span class="badge bg-secondary me-2">Room: ${item.room_number}</span>
                    <span class="badge bg-info me-2">Floor: ${item.floor}</span>
                    <span class="badge bg-primary me-2">${item.building_name}</span>
                    <span class="badge bg-success">${item.type_name}</span>
                </div>
                <p class="result-description mt-2">${item.description}</p>
                <a href="location_details.html?id=${item.id}" class="btn btn-sm btn-outline-primary mt-2">View Details</a>
            `;
            resultsContainer.appendChild(resultItem);
        });
    }
    
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
    const floorSelect = document.getElementById('floor');
    if (!floorSelect) return;
    
    // Clear current options
    floorSelect.innerHTML = '<option value="all">All Floors</option>';
    
    // If "all buildings" is selected, no floors to show
    if (buildingId === 'all') return;
    
    // Try to get building from data store
    const buildings = window.DataStore.getItems('BUILDINGS');
    const building = buildings.find(b => b.id === parseInt(buildingId));
    
    // If building not found, use default 4 floors
    const maxFloors = building ? building.floors : 4;
    
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
