document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("queryInput");
    const suggestionsBox = document.getElementById("suggestions");
    const addQueryButton = document.getElementById("addQuery");
    const queryList = document.getElementById("queryList");
    const sendButton = document.getElementById("sendRequest");
    const resultBox = document.getElementById("resultBox");
    let intellisenseData = [];
    let queries = []; // Array to store added queries
    async function loadIntellisenseData() {
        try {
            const response = await fetch("./intellisense.json");
            intellisenseData = await response.json();
        } catch (error) {
            console.error("Failed to load IntelliSense data:", error);
        }
    }
    function filterSuggestions(query) {
        if (!query) return [];
        return intellisenseData.parameters.filter(param =>
            param.name.toLowerCase().startsWith(query.toLowerCase())
        );
    }
    function displaySuggestions(suggestions) {
        suggestionsBox.innerHTML = "";
        if (suggestions.length === 0) {
            suggestionsBox.style.display = "none";
            //        return;
        }
        suggestions.forEach(suggestion => {
            const item = document.createElement("div");
            item.classList.add("suggestion-item");
            item.innerHTML = `
          <strong>${suggestion.name} (${suggestion.type})</strong>: ${suggestion.description}<br>
          Example: <code>${suggestion.example}</code><br>
          Result: ${suggestion.result}
        `;
            item.addEventListener("click", () => {
                input.value = `${suggestion.name}=`; 
                suggestionsBox.style.display = "none";
                input.focus();
            });
            suggestionsBox.appendChild(item);
        });
        suggestionsBox.style.display = "block";
    }
    addQueryButton.addEventListener("click", () => {
        const query = input.value.trim();
        if (!query) {
            alert("Please enter a valid query.");
            return;
        }
        queries.push(query);
        renderQueries();
        input.value = "";
    });
    function renderQueries() {
        queryList.innerHTML = "<p>Added Queries:</p>";
        queries.forEach((query, index) => {
            const queryItem = document.createElement("div");
            queryItem.classList.add("query-item");
            queryItem.innerHTML = `
          <input type="text" value="${query}" readonly />
          <span class="remove-query" data-index="${index}">Remove</span>
        `;
            queryItem.querySelector(".remove-query").addEventListener("click", (e) => {
                const idx = e.target.dataset.index;
                queries.splice(idx, 1); // Remove from array
                renderQueries(); // Re-render list
            });
            queryList.appendChild(queryItem);
        });
    }
    sendButton.addEventListener("click", async () => {
        if (queries.length === 0) {
            resultBox.textContent = "Please add at least one query.";
            return;
        }
        try {
            const combinedQuery = queries.join("&");
            const response = await fetch(`/api?${combinedQuery}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            resultBox.innerHTML = `
          <strong>Status:</strong> ${data.status}<br>
          <strong>Data:</strong> ${JSON.stringify(data.data, null, 2)}
        `;
        } catch (error) {
            resultBox.textContent = `Failed to fetch API response: ${error.message}`;
        }
    });
    input.addEventListener("input", () => {
        const query = input.value.trim();
        const filteredSuggestions = filterSuggestions(query);
        displaySuggestions(filteredSuggestions);
    });
    loadIntellisenseData();
});
