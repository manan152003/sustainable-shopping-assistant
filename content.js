// Scrape the product name
const productName = document.getElementById("productTitle")?.innerText.trim();

// Scrape the product price with multiple fallbacks
let productPrice = document.getElementById("priceblock_ourprice")?.innerText.trim() ||
                   document.getElementById("priceblock_dealprice")?.innerText.trim() ||
                   document.querySelector(".a-price .a-offscreen")?.innerText.trim() || 
                   "Price not available";

const description = document.getElementById("feature-bullets")?.innerText.trim();

// Send the product details to the popup
chrome.runtime.sendMessage({
  name: productName || "Name not available",
  price: productPrice,
});
