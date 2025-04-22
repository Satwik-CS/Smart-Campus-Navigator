// Building details functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize building details
    loadBuildingDetails();
});

function loadBuildingDetails() {
    // Get building ID from URL
    const params = new URLSearchParams(window.location.search);
    const buildingId = params.get('building_id');
    
    if (!buildingId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Get data from data store
    const building = window.DataStore.getItemById('BUILDINGS', parseInt(buildingId));
    if (!building) {
        document.getElementById('building-details').innerHTML = `
            <div class="alert alert-danger">
                Building with ID ${buildingId} not found. 
                <a href="index.html" class="alert-link">Return to home page</a>
            </div>
        `;
        return;
    }
    
    // Update the building details on the page
    document.getElementById('building-name-breadcrumb').textContent = building.name;
    document.getElementById('building-name-heading').textContent = building.name;
    document.getElementById('building-description').textContent = building.description || 'No description available.';
    document.getElementById('building-floors').textContent = building.floors;
    document.getElementById('hidden-building-id').value = buildingId;
    
    // Add floor options
    const floorSelect = document.getElementById('floor-select');
    for (let i = 1; i <= building.floors; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = getFloorLabel(i);
        floorSelect.appendChild(option);
    }
    
    // Count locations by type
    const locations = window.DataStore.getItems('LOCATIONS')
        .filter(loc => loc.building_id === parseInt(buildingId));
    
    const locationsByType = {};
    locations.forEach(loc => {
        if (!locationsByType[loc.type_name]) {
            locationsByType[loc.type_name] = 0;
        }
        locationsByType[loc.type_name]++;
    });
    
    // Add building facts
    const factsList = document.getElementById('building-facts');
    
    // Add count of each type of location
    Object.entries(locationsByType).forEach(([type, count]) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${count} ${type}${count !== 1 ? 's' : ''}`;
        factsList.appendChild(li);
    });
    
    // Add total count
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `Total: ${locations.length} location${locations.length !== 1 ? 's' : ''}`;
    factsList.appendChild(li);
    
    // Set up the building preview
    const buildingLocation = document.getElementById('building-location');
    buildingLocation.innerHTML = `
        <div class="text-center p-4">
            <h3>${building.name}</h3>
            <p class="mb-2">${building.floors} Floors</p>
            <div class="building-preview-box mt-3"></div>
        </div>
    `;
}

function getFloorLabel(floor) {
    if (floor === 1) return '1st Floor';
    else if (floor === 2) return '2nd Floor';
    else if (floor === 3) return '3rd Floor';
    else return `${floor}th Floor`;
}