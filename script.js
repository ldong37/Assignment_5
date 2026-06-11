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

// Asynchronous call to the City of Winnipeg Open Data API
async function fetchTreeData(commonName) {
    // Socrata Endpoint URL layout matching Page 3 guidelines
    const endpointUrl = "https://data.winnipeg.ca/resource/d3jk-hb6j.json";
    const queryParams = `?$where=lower(common_name) LIKE lower('%${commonName}%')&$order=diameter_at_breast_height DESC&$limit=100`;
    const fullUrl = encodeURI(endpointUrl + queryParams);

    try {
        // Reset UI presentation while loading
        updateStatus("Fetching latest city tree records...", "info-msg");
        resultsTable.classList.add('hidden');
        tableBody.innerHTML = '';
        // Network Request Execution
        const response = await fetch(fullUrl);