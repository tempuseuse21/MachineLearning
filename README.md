# 🏠 Airbnb Price Predictor

A full-stack ML web application that predicts Airbnb nightly prices using XGBoost.

---

## 📁 Project Structure

```
airbnb-predictor/
├── backend/
│   ├── app.py               # Flask API
│   ├── requirements.txt     # Python dependencies
│   └── models/              # Place your .pkl files here
│       ├── best_airbnb_model.pkl
│       ├── scaler.pkl
│       └── features.pkl
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   ├── index.css
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Predict.js
    │   │   └── About.js
    │   └── components/
    │       └── Navbar.js
    ├── package.json
    └── tailwind.config.js
```

---

## 🚀 Setup & Run Instructions

### Step 1 — Copy your model files

Place your three `.pkl` files into `backend/models/`:

```
backend/models/best_airbnb_model.pkl
backend/models/scaler.pkl
backend/models/features.pkl
```

---

### Step 2 — Backend (Flask API)

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The API will start at **http://localhost:5000**

---

### Step 3 — Frontend (React)

Open a **new terminal**:

```bash
cd frontend

# Install Node dependencies
npm install

# Start the dev server
npm start
```

The app will open at **http://localhost:3000**

> The React app proxies `/predict` and `/features` requests to `localhost:5000` automatically (configured in `package.json`).

---

## 🌐 API Endpoints

| Method | Route        | Description              |
|--------|-------------|--------------------------|
| GET    | `/health`   | Health check + features  |
| GET    | `/features` | Feature list + metadata  |
| POST   | `/predict`  | Returns predicted price  |

### POST `/predict` — Example payload

```json
{
  "city": "NYC",
  "property_type": "Apartment",
  "room_type": "Entire home/apt",
  "accommodates": 4,
  "bedrooms": 2,
  "beds": 2,
  "bathrooms": 1,
  "bed_type": "Real Bed",
  "amenities_count": 20,
  "cleaning_fee": "True",
  "cancellation_policy": "moderate",
  "instant_bookable": "f",
  "host_has_profile_pic": "t",
  "host_identity_verified": "t",
  "host_response_rate": 95,
  "host_since": 2015,
  "first_review": 2016,
  "last_review": 2023,
  "thumbnail_url": 1
}
```

### Response

```json
{
  "success": true,
  "price_usd": 147.32,
  "price_inr": 12231.56,
  "log_price": 4.9921
}
```

---

## 🤖 Model Details

- **Best Model:** XGBoost Regressor
- **Target:** `log_price` (log of nightly USD price)
- **Encoding:** Target Encoding on categorical features
- **Scaling:** StandardScaler
- **Output conversion:** `price = exp(log_price) × 83 (USD→INR)`

---

## 📦 Requirements

- **Python** 3.9+
- **Node.js** 18+
- **npm** 9+
