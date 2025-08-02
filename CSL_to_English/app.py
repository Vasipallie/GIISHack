import os
import cv2
import numpy as np
import base64
import pickle
import mediapipe as mp
from flask import Flask, render_template, request, jsonify
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from collections import Counter

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, TensorDataset

app = Flask(__name__)

# Globals
data = []
labels = []
model_path = "torch_model.pt"
label_encoder_path = "label_encoder.pkl"
data_path = "gesture_data.pkl"

# Mediapipe hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=2)

# Load previous data if exists
if os.path.exists(data_path):
    with open(data_path, 'rb') as f:
        saved = pickle.load(f)
        data = saved['data']
        labels = saved['labels']

# PyTorch model
class SignModel(nn.Module):
    def __init__(self, input_size, output_size):
        super(SignModel, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(input_size, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, output_size)
        )

    def forward(self, x):
        return self.net(x)

def extract_landmarks(base64_data):
    encoded_data = base64_data.split(',')[1]
    img_bytes = base64.b64decode(encoded_data)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = hands.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    landmarks = []

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            for lm in hand_landmarks.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])

    while len(landmarks) < 126:
        landmarks.append(0.0)

    if len(landmarks) != 126:
        raise ValueError("Could not extract full 2-hand landmarks.")
    
    return landmarks

def train_model():
    if not data or not labels:
        return

    X = torch.tensor(data, dtype=torch.float32)
    le = LabelEncoder()
    y_encoded = le.fit_transform(labels)
    y = torch.tensor(y_encoded, dtype=torch.long)

    num_classes = len(set(y_encoded))
    input_size = X.shape[1]

    model = SignModel(input_size, num_classes)
    loss_fn = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    dataset = TensorDataset(X, y)
    loader = DataLoader(dataset, batch_size=32, shuffle=True)

    for epoch in range(20):
        for batch_X, batch_y in loader:
            optimizer.zero_grad()
            outputs = model(batch_X)
            loss = loss_fn(outputs, batch_y)
            loss.backward()
            optimizer.step()

    torch.save(model.state_dict(), model_path)
    with open(label_encoder_path, 'wb') as f:
        pickle.dump(le, f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/capture', methods=['POST'])
def capture():
    label = request.form['label']
    img_data = request.form['image']
    try:
        vector = extract_landmarks(img_data)
        data.append(vector)
        labels.append(label)

        with open(data_path, 'wb') as f:
            pickle.dump({'data': data, 'labels': labels}, f)

        train_model()
        return jsonify({'status': 'success', 'message': f'Trained on "{label}" gesture.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/predict', methods=['POST'])
def predict():
    img_data = request.form['image']
    if not os.path.exists(model_path) or not os.path.exists(label_encoder_path):
        return jsonify({'status': 'error', 'message': 'Model not trained yet.'})

    try:
        vector = extract_landmarks(img_data)
        input_tensor = torch.tensor(vector, dtype=torch.float32).unsqueeze(0)

        with open(label_encoder_path, 'rb') as f:
            le = pickle.load(f)

        model = SignModel(126, len(le.classes_))
        model.load_state_dict(torch.load(model_path))
        model.eval()

        with torch.no_grad():
            outputs = model(input_tensor)
            probs = torch.softmax(outputs, dim=1)
            pred = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred].item()
            predicted_label = le.inverse_transform([pred])[0]

        return jsonify({'status': 'success', 'prediction': predicted_label, 'confidence': confidence})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/gestures', methods=['GET'])
def get_gestures():
    return jsonify(dict(Counter(labels)))

@app.route('/clear', methods=['POST'])
def clear_data():
    global data, labels
    data, labels = [], []
    for path in [model_path, label_encoder_path, data_path]:
        if os.path.exists(path):
            os.remove(path)
    return jsonify({'status': 'success', 'message': 'All data cleared.'})

if __name__ == '__main__':
    app.run(debug=True)
