from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow all origins for development

# Load your trained model and scaler
model = joblib.load("xgboost_sonar_model.pkl")      # Replace with your actual model filename
scaler = joblib.load("scaler.pkl")    # Replace with your actual scaler filename

@app.route('/')
def home():
    return "ML Flask API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse JSON input
        data = request.get_json()

        # Example: assume frontend sends {"features": [value1, value2, ...]}
        features = data.get("features")

        if features is None or not isinstance(features, list):
            return jsonify({"error": "Invalid input. Expected 'features': [list]"}), 400

        # Preprocess the input (scale)
        input_data = np.array([features])
        scaled_input = scaler.transform(input_data)

        # Get prediction
        prediction = model.predict(scaled_input)

        # Return response
        return jsonify({
            "prediction": prediction.tolist()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
