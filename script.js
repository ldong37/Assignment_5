// Target UI elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const tableBody = document.getElementById('table-body');
const resultsTable = document.getElementById('results-table');
const statusMessage = document.getElementById('status-message');

// Add typing area for user input
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === "") {
        updateStatus("Please type a tree name first!", "error-msg");
        return;
    }
    
    fetchTreeData(searchTerm);
});