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
    contentDiv.innerHTML = `
      <h3>Product Details</h3>
      <p><strong>Name:</strong> ${message.name}</p>
      <p><strong>Price:</strong> ${message.price}</p>
    `;
  });
  