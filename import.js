// Import functionality for static demo

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
            
            // In a real application, this would submit the file to the backend
            // For this static version, we'll just show a success message
            let formType = '';
            
            if (form.id === 'buildings-form') formType = 'buildings';
            else if (form.id === 'location-types-form') formType = 'location types';
            else if (form.id === 'locations-form') formType = 'locations';
            else if (form.id === 'paths-form') formType = 'paths';
            
            showAlert(`Successfully imported ${formType} from ${file.name}`, 'success');
            
            // Reset the form
            form.reset();
        });
    });
}

function setupClearDataButton() {
    const clearDataBtn = document.getElementById('clear-data-btn');
    if (!clearDataBtn) return;
    
    clearDataBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all campus data? This action cannot be undone!')) {
            // In a real application, this would send a request to the backend
            // For this static version, we'll just show a success message
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