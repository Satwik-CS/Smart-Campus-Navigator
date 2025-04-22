// Campus Map functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the campus map
    initializeCampusMap();
    
    // Add event listeners for building selection if on index page
    if (document.getElementById('building_id')) {
        document.getElementById('building_id').addEventListener('change', function() {
            updateFloorOptions(this.value);
        });
    }
});

function initializeCampusMap() {
    // Get the map SVG element
    const campusMap = document.getElementById('campus-map');
    if (!campusMap) return;
    
    // Add pan and zoom functionality
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0, scale = 1;
    
    // Mouse events for panning
    campusMap.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        campusMap.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        applyTransform();
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        campusMap.style.cursor = 'grab';
    });
    
    // Scroll for zooming
    campusMap.addEventListener('wheel', function(e) {
        e.preventDefault();
        const xs = (e.clientX - translateX) / scale;
        const ys = (e.clientY - translateY) / scale;
        scale += e.deltaY * -0.01;
        scale = Math.min(Math.max(0.5, scale), 4); // Limit scale
        translateX = e.clientX - xs * scale;
        translateY = e.clientY - ys * scale;
        applyTransform();
    });
    
    function applyTransform() {
        campusMap.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
    
    // Make buildings clickable
    const buildings = campusMap.querySelectorAll('rect');
    buildings.forEach(building => {
        building.style.cursor = 'pointer';
        building.addEventListener('click', function() {
            // Here you would typically get the building ID and redirect
            // For this static version, we'll just redirect to a sample
            // window.location.href = 'search_results.html?building_id=' + buildingId;
            alert('Building clicked - would redirect to search results');
        });
        
        // Hover effect
        building.addEventListener('mouseenter', function() {
            this.setAttribute('fill-opacity', '0.8');
        });
        
        building.addEventListener('mouseleave', function() {
            this.setAttribute('fill-opacity', '1');
        });
    });
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