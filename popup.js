document.getElementById("scan-btn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      });
    });
  });

chrome.runtime.onMessage.addListener((message) => {
  const contentDiv = document.getElementById("content");
  
  // error checking
  if (!message || typeof message !== 'object') {
      contentDiv.innerHTML = '<p>Error: Invalid data received</p>';
      return;
  }

  let html = `
      <h3>Product Information</h3>
      <div class="product-info">
          <p><strong>Name:</strong> ${message.name || 'Not available'}</p>
          <p><strong>Price:</strong> ${message.price || 'Not available'}</p>
      </div>`;

  // only if available
  if (message.sustainability && message.sustainability.score !== undefined) {
      const score = Math.round(message.sustainability.score);
      const scoreColor = getScoreColor(score);
      
      html += `
          <div class="sustainability-section">
              <h3>Sustainability Analysis</h3>
              <div class="score-display" style="color: ${scoreColor}">
                  <span class="score-number">${score}</span>
                  <span class="score-total">/100</span>
              </div>
              <p class="level-indicator" style="color: ${scoreColor}">
                  <strong>Level:</strong> ${message.sustainability.sustainabilityLevel}
              </p>
              ${message.sustainability.features && message.sustainability.features.length > 0 ? `
                  <div class="features-section">
                      <strong>Key Features:</strong>
                      <ul>
                          ${message.sustainability.features.map(feature => 
                              `<li>
                                  <span class="feature-name">${feature.feature}</span>
                                  <span class="feature-confidence">${Math.round(feature.confidence)}% confidence</span>
                              </li>`
                          ).join('')}
                      </ul>
                  </div>
              ` : ''}
          </div>`;
  }

  contentDiv.innerHTML = html;
});

function getScoreColor(score) {
  if (score >= 80) return '#2ecc71'; // Green
  if (score >= 60) return '#3498db'; // Blue
  if (score >= 40) return '#f1c40f'; // Yellow
  if (score >= 20) return '#e67e22'; // Orange
  return '#e74c3c'; // Red
}