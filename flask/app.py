from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
from transformers import pipeline # type: ignore
import torch # type: ignore

app = Flask(__name__)
CORS(app)  

# Initialize the zero-shot classification pipeline
classifier = pipeline("zero-shot-classification",
                     model="facebook/bart-large-mnli",
                     device=0 if torch.cuda.is_available() else -1)

# Define sustainability categories
SUSTAINABILITY_LABELS = [
    "environmentally friendly",
    "organic materials",
    "recycled materials",
    "sustainable production",
    "energy efficient",
    "plastic free",
    "fair trade",
    "carbon neutral",
    "harmful to environment",
    "non-recyclable"
]

@app.route('/analyze', methods=['POST'])
def analyze_sustainability():
    data = request.json
    text = data.get('description', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Perform zero-shot classification
    result = classifier(text, SUSTAINABILITY_LABELS, multi_label=True)
    
    # Calculate sustainability score
    positive_labels = SUSTAINABILITY_LABELS[:-2]  # All except last two negative labels
    negative_labels = SUSTAINABILITY_LABELS[-2:]   # Last two negative labels
    
    # Get scores for positive and negative aspects
    scores = {label: score for label, score in zip(result['labels'], result['scores'])}
    
    # Calculate weighted score (positive aspects contribute positively, negative ones negatively)
    total_score = 0
    features = []
    
    for label in positive_labels:
        score = scores[label]
        if score > 0.5:  # Consider only if confidence is over 50%
            total_score += score
            features.append({"feature": label, "confidence": round(score * 100, 2)})
    
    for label in negative_labels:
        score = scores[label]
        if score > 0.5:
            total_score -= score
            features.append({"feature": label, "confidence": round(score * 100, 2)})
    
    # Normalize score to 0-100 range
    normalized_score = min(max((total_score + len(negative_labels)) * (100 / (len(SUSTAINABILITY_LABELS))), 0), 100)
    
    return jsonify({
        'score': round(normalized_score, 2),
        'features': features,
        'sustainabilityLevel': get_sustainability_level(normalized_score)
    })

def get_sustainability_level(score):
    if score >= 80:
        return 'Excellent'
    elif score >= 60:
        return 'Good'
    elif score >= 40:
        return 'Moderate'
    elif score >= 20:
        return 'Poor'
    return 'Very Poor'

if __name__ == '__main__':
    app.run(debug=True, port=5000)