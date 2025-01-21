const productName = document.getElementById("productTitle")?.innerText.trim();
let productPrice = document.getElementById("priceblock_ourprice")?.innerText.trim() ||
    document.getElementById("priceblock_dealprice")?.innerText.trim() ||
    document.querySelector(".a-price .a-offscreen")?.innerText.trim() ||
    "Price not available";

const description = document.getElementById("feature-bullets")?.innerText.trim();

// Sending product description to Flask backend
async function analyzeSustainability(description) {
    try {
        const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: description })
        });
        
        const sustainabilityData = await response.json();
        
        // Send complete data to popup
        chrome.runtime.sendMessage({
            name: productName || "Name not available",
            price: productPrice,
            sustainability: sustainabilityData
        });
    } catch (error) {
        console.error('Error analyzing sustainability:', error);
        chrome.runtime.sendMessage({
            name: productName || "Name not available",
            price: productPrice,
            sustainability: {
                score: 0,
                sustainabilityLevel: 'Analysis Failed',
                features: []
            }
        }); 
    }
}

if (description) {
    analyzeSustainability(description);
}