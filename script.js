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
        // Explicit status code safety verification 
        if (!response.ok) {
            throw new Error(`Server returned a critical network error: ${response.status}`);
        }
        // Parse JSON output payload
        const treeRecords = await response.json();
        // Guard clause for missing or empty results
        if (treeRecords.length === 0) {
            updateStatus("No matching public records found. Try another tree type.", "error-msg");
            return;
        }
        // Clear information messages and populate data rows
        statusMessage.classList.add('hidden');
        renderTableRows(treeRecords);
        } catch (err) {
        console.error("App Failure Trace:", err);
        updateStatus(`Failed to pull data: ${err.message}`, "error-msg");
    }
}
// Extract properties using modern JavaScript destructuring
function renderTableRows(treeList) {
    treeList.forEach(tree => {
        // Safe properties destructuring with explicit fallbacks
        const { 
            common_name = "Unknown", 
            botanical_name = "N/A", 
            diameter_at_breast_height = "N/A", 
            street = "Not listed", 
            neighbourhood = "Not listed" 
        } = tree;

        // Construct HTML table row element
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td><strong>${common_name}</strong></td>
            <td><em>${botanical_name}</em></td>
            <td>${diameter_at_breast_height} cm</td>
            <td>${street}</td>
            <td>${neighbourhood}</td>
        `;
        
        tableBody.appendChild(tableRow);
    });

    // Reveal populated results grid
    resultsTable.classList.remove('hidden');
}

// Centralized status visibility manager
function updateStatus(message, styleClass) {
    statusMessage.textContent = message;
    statusMessage.className = styleClass; // swap text styling color definitions dynamically
    statusMessage.classList.remove('hidden');
    resultsTable.classList.add('hidden');
}