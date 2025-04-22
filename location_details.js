// Location details functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize location details
    displayLocationDetails();
});

function displayLocationDetails() {
    // Get location ID from URL
    const params = new URLSearchParams(window.location.search);
    const locationId = params.get('id');
    
    if (!locationId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Get data from data store
    const location = window.DataStore.getItemById('LOCATIONS', parseInt(locationId));
    if (!location) {
        document.getElementById('location-details').innerHTML = `
            <div class="alert alert-danger">
                Location with ID ${locationId} not found. 
                <a href="index.html" class="alert-link">Return to home page</a>
            </div>
        `;
        return;
    }
    
    // Get building information
    const building = window.DataStore.getItemById('BUILDINGS', location.building_id);
    
    // Get connected locations (paths)
    const paths = window.DataStore.getItems('PATHS')
        .filter(path => path.from_location_id === parseInt(locationId));
    
    const connectedLocations = paths.map(path => {
        const toLocation = window.DataStore.getItemById('LOCATIONS', path.to_location_id);
        return {
            ...toLocation,
            distance: path.distance
        };
    });
    
    // Get nearby locations (in same building and floor)
    const nearby = window.DataStore.getItems('LOCATIONS')
        .filter(loc => 
            loc.building_id === location.building_id && 
            loc.floor === location.floor && 
            loc.id !== parseInt(locationId)
        )
        .slice(0, 5); // Limit to 5 nearby locations
    
    // Update breadcrumb
    document.getElementById('building-name-breadcrumb').textContent = building ? building.name : 'Unknown Building';
    document.getElementById('location-name-breadcrumb').textContent = location.name;
    
    // Update location name
    document.getElementById('location-name-heading').textContent = location.name;
    
    // Update location information
    document.getElementById('room-number').textContent = location.room_number;
    document.getElementById('building-name').textContent = building ? building.name : 'Unknown Building';
    document.getElementById('floor-number').textContent = getFloorLabel(location.floor);
    document.getElementById('location-type').textContent = location.type_name;
    
    if (location.capacity) {
        document.getElementById('capacity').textContent = `${location.capacity} people`;
    } else {
        document.getElementById('capacity-container').style.display = 'none';
    }
    
    if (location.facilities) {
        document.getElementById('facilities').textContent = location.facilities;
    } else {
        document.getElementById('facilities-container').style.display = 'none';
    }
    
    document.getElementById('location-description').textContent = location.description || 'No description available.';
    
    // Update connected locations
    const connectedContainer = document.getElementById('connected-locations');
    if (connectedLocations.length === 0) {
        connectedContainer.innerHTML = '<p>No connected locations available.</p>';
    } else {
        connectedContainer.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'list-group list-group-flush';
        
        connectedLocations.forEach(loc => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <a href="location_details.html?id=${loc.id}">${loc.name} (${loc.room_number})</a>
                <span class="badge bg-secondary rounded-pill">${loc.distance}m</span>
            `;
            ul.appendChild(li);
        });
        
        connectedContainer.appendChild(ul);
    }
    
    // Update nearby locations
    const nearbyContainer = document.getElementById('nearby-locations');
    if (nearby.length === 0) {
        nearbyContainer.innerHTML = '<p>No nearby locations available.</p>';
    } else {
        nearbyContainer.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'list-group';
        
        nearby.forEach(loc => {
            const a = document.createElement('a');
            a.href = `location_details.html?id=${loc.id}`;
            a.className = 'list-group-item list-group-item-action';
            a.textContent = `${loc.name} (${loc.room_number})`;
            div.appendChild(a);
        });
        
        nearbyContainer.appendChild(div);
    }
    
    // Initialize location map
    initializeLocationMap(location, building);
}

function initializeLocationMap(location, building) {
    // Implementation depends on your map needs
    // This is a placeholder
    console.log('Location map would be initialized with:', location, building);
}

function getFloorLabel(floor) {
    if (floor === 1) return '1st Floor';
    else if (floor === 2) return '2nd Floor';
    else if (floor === 3) return '3rd Floor';
    else return `${floor}th Floor`;
}