
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
from flask import Flask, request, jsonify
import numpy as np
import joblib
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

MODEL_DIR = os.path.join("models", "xgb")
DATA_DIR = os.path.join("data", "processed")

# İzin verilen hisseler
ALLOWED_STOCKS = [
    "ASELS", "BIMAS", "EREGL", "FROTO", "KOZAL",
    "KRDMD", "SASA", "SISE", "THYAO", "TUPRS"
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        stock = data.get("stock")
        date_str = data.get("date")

        # Giriş validasyonu
        if not stock or not date_str:
            return jsonify({"error": "Hisse kodu ve tarih gereklidir."}), 400

        if stock not in ALLOWED_STOCKS:
            return jsonify({"error": f"Bu hisse için tahmin modeli bulunmamaktadır. Mevcut hisseler: {', '.join(ALLOWED_STOCKS)}"}), 400

        # Tarih validasyonu
        try:
            requested_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            today = datetime.today().date()
            delta = (requested_date - today).days
            
            if delta < 0:
                return jsonify({"error": "Geçmiş tarihler için tahmin yapılamaz."}), 400
            elif delta > 30:
                return jsonify({"error": "Maksimum 30 gün sonrası için tahmin yapılabilir."}), 400
                
        except ValueError:
            return jsonify({"error": "Geçerli bir tarih formatı giriniz (YYYY-MM-DD)."}), 400

        # Model ve veri dosyası yolları
        model_path = os.path.join(BASE_DIR, MODEL_DIR, f"{stock}_xgb.pkl")
        X_path = os.path.join(BASE_DIR, DATA_DIR, f"{stock}_X.npy")

        # Dosya varlığı kontrolü
        if not os.path.exists(model_path):
            return jsonify({"error": f"{stock} için model dosyası bulunamadı."}), 404
            
        if not os.path.exists(X_path):
            return jsonify({"error": f"{stock} için veri dosyası bulunamadı."}), 404

        # Model ve veriyi yükle
        try:
            model = joblib.load(model_path)
            X = np.load(X_path)
            
            if len(X) == 0:
                return jsonify({"error": f"{stock} için yeterli veri bulunmamaktadır."}), 400
                
            # Son günün verisini al ve tahmin yap
            X_last = X[-1].reshape(1, -1)
            
            # Tahmin yap
            price_prediction = model.predict(X_last)[0]
            price = round(float(price_prediction), 2)

            # Güven aralığı hesapla (%2 oynama payı)
            confidence_range = 0.02
            min_price = round(price * (1 - confidence_range), 2)
            max_price = round(price * (1 + confidence_range), 2)

            # Başarılı response
            return jsonify({
                "success": True,
                "stock": stock,
                "date": date_str,
                "price": price,
                "minPrice": min_price,
                "maxPrice": max_price,
                "model": "XGBoost Regressor",
                "daysAhead": delta
            }), 200

        except Exception as model_error:
            return jsonify({"error": f"Model yükleme/tahmin hatası: {str(model_error)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Beklenmeyen hata: {str(e)}"}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "AI Prediction API is running",
        "available_stocks": ALLOWED_STOCKS,
        "max_prediction_days": 30
    }), 200

# Mevcut modelleri listele
@app.route('/models', methods=['GET'])
def list_models():
    try:
        model_dir_path = os.path.join(BASE_DIR, MODEL_DIR)
        available_models = []
        
        for stock in ALLOWED_STOCKS:
            model_path = os.path.join(model_dir_path, f"{stock}_xgb.pkl")
            data_path = os.path.join(BASE_DIR, DATA_DIR, f"{stock}_X.npy")
            
            model_exists = os.path.exists(model_path)
            data_exists = os.path.exists(data_path)
            
            available_models.append({
                "stock": stock,
                "model_available": model_exists,
                "data_available": data_exists,
                "ready": model_exists and data_exists
            })
        
        return jsonify({
            "models": available_models,
            "total_stocks": len(ALLOWED_STOCKS),
            "ready_count": sum(1 for m in available_models if m["ready"])
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Model listesi alınamadı: {str(e)}"}), 500

if __name__ == '__main__':
    print("🤖 AI Prediction API başlatılıyor...")
    print(f"📁 Model klasörü: {os.path.join(BASE_DIR, MODEL_DIR)}")
    print(f"📊 Veri klasörü: {os.path.join(BASE_DIR, DATA_DIR)}")
    print(f"🎯 Desteklenen hisseler: {', '.join(ALLOWED_STOCKS)}")
    print("🌐 API Endpoints:")
    print("   POST /predict - Hisse tahmini")
    print("   GET /health - Sistem durumu") 
    print("   GET /models - Model listesi")
    print("🚀 Sunucu http://localhost:5000 adresinde çalışıyor...")
    
    app.run(debug=True, host='0.0.0.0', port=5000)

