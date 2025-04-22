// Import functionality for CSV data

document.addEventListener('DOMContentLoaded', function() {
    setupImportForms();
    setupClearDataButton();
});

function setupImportForms() {
    const importForms = document.querySelectorAll('.import-form');
    
    importForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the file input
            const fileInput = this.querySelector('input[type="file"]');
            if (!fileInput.files.length) {
                showAlert('No file selected', 'danger');
                return;
            }
            
            const file = fileInput.files[0];
            if (!file.name.endsWith('.csv')) {
                showAlert('File must be CSV format', 'danger');
                return;
            }
            
            // Determine which form was submitted
            let formType = '';
            if (form.id === 'buildings-form') formType = 'buildings';
            else if (form.id === 'location-types-form') formType = 'location_types';
            else if (form.id === 'locations-form') formType = 'locations';
            else if (form.id === 'paths-form') formType = 'paths';
            
            // Read and process the file
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvData = e.target.result;
                try {
                    const importedCount = processCSV(formType, csvData);
                    showAlert(`Successfully imported ${importedCount} ${formType}`, 'success');
                } catch (error) {
                    showAlert(`Error importing data: ${error.message}`, 'danger');
                }
            };
            reader.readAsText(file);
            
            // Reset the form
            form.reset();
        });
    });
}

function processCSV(type, csvData) {
    const lines = csvData.split('\n');
    if (lines.length < 2) {
        throw new Error('CSV file must have header row and at least one data row');
    }
    
    // Parse header row to get field names
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Process data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines
        
        // Handle quoted values with commas inside them
        const values = parseCSVLine(line);
        
        if (values.length !== headers.length) {
            console.warn(`Line ${i+1} has ${values.length} values, expected ${headers.length}`);
            continue;
        }
        
        // Create object from headers and values
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        
        // Process special fields depending on type
        if (type === 'buildings') {
            obj.floors = parseInt(obj.floors) || 1;
        } else if (type === 'locations') {
            obj.floor = parseInt(obj.floor) || 1;
            obj.capacity = obj.capacity ? parseInt(obj.capacity) : null;
            obj.x_coordinate = obj.x_coordinate ? parseFloat(obj.x_coordinate) : null;
            obj.y_coordinate = obj.y_coordinate ? parseFloat(obj.y_coordinate) : null;
        } else if (type === 'paths') {
            obj.distance = parseFloat(obj.distance) || 0;
        }
        
        data.push(obj);
    }
    
    // Store the data
    if (type === 'buildings') {
        // Store buildings directly
        const buildings = data.map((b, index) => ({
            id: index + 1,
            code: b.code,
            name: b.name,
            description: b.description,
            floors: b.floors
        }));
        window.DataStore.storeItems('BUILDINGS', buildings);
        return buildings.length;
    } 
    else if (type === 'location_types') {
        // Store location types directly
        const locationTypes = data.map((lt, index) => ({
            id: index + 1,
            name: lt.name,
            description: lt.description
        }));
        window.DataStore.storeItems('LOCATION_TYPES', locationTypes);
        return locationTypes.length;
    } 
    else if (type === 'locations') {
        // For locations, we need to find building IDs and location type IDs
        const buildings = window.DataStore.getItems('BUILDINGS');
        const locationTypes = window.DataStore.getItems('LOCATION_TYPES');
        
        if (!buildings.length) {
            throw new Error('No buildings found. Please import buildings first.');
        }
        
        if (!locationTypes.length) {
            throw new Error('No location types found. Please import location types first.');
        }
        
        const locations = [];
        let nextId = 1;
        
        data.forEach(loc => {
            // Find building by code
            const building = buildings.find(b => b.code === loc.building_code);
            if (!building) {
                console.warn(`Building code ${loc.building_code} not found, skipping location`);
                return;
            }
            
            // Find location type by name
            const locationType = locationTypes.find(lt => lt.name === loc.type_name);
            if (!locationType) {
                console.warn(`Location type ${loc.type_name} not found, skipping location`);
                return;
            }
            
            locations.push({
                id: nextId++,
                name: loc.name,
                room_number: loc.room_number,
                floor: loc.floor,
                building_id: building.id,
                building_code: building.code,
                building_name: building.name,
                type_id: locationType.id,
                type_name: locationType.name,
                description: loc.description,
                capacity: loc.capacity,
                x_coordinate: loc.x_coordinate,
                y_coordinate: loc.y_coordinate,
                facilities: loc.facilities
            });
        });
        
        window.DataStore.storeItems('LOCATIONS', locations);
        return locations.length;
    } 
    else if (type === 'paths') {
        // For paths, we need to find location IDs
        const locations = window.DataStore.getItems('LOCATIONS');
        
        if (!locations.length) {
            throw new Error('No locations found. Please import locations first.');
        }
        
        const paths = [];
        let nextId = 1;
        
        data.forEach(p => {
            // Find from and to locations by room number
            const fromLocation = locations.find(l => l.room_number === p.from_room);
            if (!fromLocation) {
                console.warn(`From room ${p.from_room} not found, skipping path`);
                return;
            }
            
            const toLocation = locations.find(l => l.room_number === p.to_room);
            if (!toLocation) {
                console.warn(`To room ${p.to_room} not found, skipping path`);
                return;
            }
            
            // Create the path
            paths.push({
                id: nextId++,
                from_location_id: fromLocation.id,
                to_location_id: toLocation.id,
                from_room: p.from_room,
                to_room: p.to_room,
                distance: p.distance
            });
            
            // Create reverse path for bidirectional navigation
            paths.push({
                id: nextId++,
                from_location_id: toLocation.id,
                to_location_id: fromLocation.id,
                from_room: p.to_room,
                to_room: p.from_room,
                distance: p.distance
            });
        });
        
        window.DataStore.storeItems('PATHS', paths);
        return paths.length / 2; // Count only one-way paths
    }
    
    return 0;
}

function parseCSVLine(line) {
    const result = [];
    let cell = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(cell);
            cell = '';
        } else {
            cell += char;
        }
    }
    
    // Add the last cell
    result.push(cell);
    
    // Clean up quotes from cells
    return result.map(cell => {
        if (cell.startsWith('"') && cell.endsWith('"')) {
            return cell.substring(1, cell.length - 1);
        }
        return cell.trim();
    });
}

function setupClearDataButton() {
    const clearDataBtn = document.getElementById('clear-data-btn');
    if (!clearDataBtn) return;
    
    clearDataBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all campus data? This action cannot be undone!')) {
            window.DataStore.clearAllData();
            showAlert('All campus data has been cleared', 'success');
        }
    });
}

function showAlert(message, type) {
    const alertsContainer = document.getElementById('import-alerts');
    if (!alertsContainer) return;
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to container
    alertsContainer.appendChild(alert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.remove();
        }, 150);
    }, 5000);
}
