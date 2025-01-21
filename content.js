// Get product name
const productName = document.getElementById("productTitle")?.innerText.trim();

// Get product price
const productPrice = document.getElementById("priceblock_ourprice")?.innerText.trim() ||
                     document.getElementById("priceblock_dealprice")?.innerText.trim();

// Send data back to the extension
chrome.runtime.sendMessage({
  name: productName || "N/A",
  price: productPrice || "N/A",
});
