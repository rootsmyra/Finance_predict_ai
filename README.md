# 📈 Finance AI - Hisse Senedi Tahmin Sistemi

Gerçek zamanlı finansal veriler ve AI destekli hisse senedi tahminleri sunan web uygulaması.

## 🚀 Özellikler

### 📊 **Canlı Veriler**
- **📰 Haberler** - NewsData.io API ile gerçek zamanlı finansal haberler
- **💱 Döviz Kurları** - ExchangeRate-API ile güncel kurlar

### 📁 **Dosya Yükleme Sistemi**
- **📈 Hisse Senetleri** - Excel dosyası yükleme (tumhisse.xlsx)
- **📊 Endeksler** - Excel dosyası yükleme (endeksbist.xlsx)
- **🥇 Emtia Fiyatları** - Excel dosyası yükleme (emtia.xlsx)
- **₿ Kripto Paralar** - CSV dosyası yükleme (Kripto Paralar.csv)

### 🤖 **AI Tahmin Sistemi**
- **XGBoost** modeli ile hisse senedi fiyat tahmini
- **10 farklı hisse** için eğitilmiş modeller
- **30 güne kadar** gelecek tahminleri

## 📋 Desteklenen Hisseler (AI Tahmin)

- ASELS (Aselsan)
- BIMAS (BIM)
- EREGL (Ereğli Demir Çelik)
- FROTO (Ford Otosan)
- KOZAL (Koza Altın)
- KRDMD (Kardemir)
- SASA (Sasa Polyester)
- SISE (Şişe Cam)
- THYAO (Türk Hava Yolları)
- TUPRS (Tüpraş)

## 🛠️ Kurulum

### 📋 Gereksinimler

#### Python Kütüphaneleri:
```bash
pip install flask flask-cors numpy joblib scikit-learn xgboost
```

#### Klasör Yapısı:
```
finance_ai/
├── app.py
├── index.html
├── css/
│   └── main.css
├── js/
│   ├── config.js
│   ├── utils.js
│   ├── excel-handler.js
│   ├── file-upload-managers.js
│   ├── stock-manager.js
│   ├── news-manager.js
│   ├── currency-manager.js
│   ├── index-manager.js
│   ├── mta-manager.js
│   ├── crypto-manager.js
│   ├── modal-manager.js
│   ├── chart-manager.js
│   ├── prediction-manager.js
│   └── main.js
├── data/
│   └── processed/
│       ├── ASELS_X.npy
│       ├── ASELS_y.npy
│       └── ... (diğer hisseler)
├── models/
│   └── xgb/
│       ├── ASELS_xgb.pkl
│       ├── BIMAS_xgb.pkl
│       └── ... (diğer hisseler)
└── public/
    └── endeksler.json
```

## 🚀 Başlatma

### 1️⃣ **AI Sunucusunu Başlat**
```bash
cd finance_ai
python app.py
```
✅ Çıktı: `Running on http://127.0.0.1:5000`

### 2️⃣ **Web Sunucusunu Başlat**
Yeni terminal penceresi açın:
```bash
cd finance_ai
python -m http.server 5500
```

### 3️⃣ **Uygulamayı Aç**
Tarayıcıda şu adresi açın:
```
http://localhost:5500/index.html
```

## 📊 Kullanım

### **Excel/CSV Dosyası Yükleme:**
1. İlgili bölümdeki "📂 Dosya Yükle" butonuna tıklayın
2. Dosyayı seçin ve yükleyin
3. Veriler otomatik olarak tabloya aktarılır
4. Yükleme butonu otomatik gizlenir

### **AI Tahmin Yapma:**
1. Desteklenen hisselerden birine tıklayın (yeşil kenarlı)
2. Modal pencerede "📅 Tarihe Göre Tahmin" butonuna tıklayın
3. Gelecek tarih seçin (maksimum 30 gün)
4. "Tahmin Et" butonuna tıklayın
5. AI tahmini görüntülenir

## 🧪 Test

### **AI Sistemini Test Etme:**
Terminal'de şu komutu çalıştırın:
```bash
curl -X POST http://localhost:5000/predict -H "Content-Type: application/json" -d "{\"stock\":\"BIMAS\", \"date\":\"2025-06-20\"}"
```

**Beklenen Çıktı:**
```json
{
  "success": true,
  "stock": "BIMAS",
  "date": "2025-06-20",
  "price": 142.50,
  "minPrice": 139.65,
  "maxPrice": 145.35,
  "model": "XGBoost Regressor",
  "daysAhead": 178
}
```

## 🔧 API Endpoints

- **POST /predict** - Hisse tahmini
- **GET /health** - Sistem durumu
- **GET /models** - Mevcut modeller

## 📱 Özellikler

### ✅ **Canlı Özellikler:**
- Otomatik haber slaytı (10 saniye)
- Döviz kurları güncelleme (10 dakika)
- Responsive tasarım
- Modal hisse detayları
- TradingView grafikleri

### ✅ **Geliştirici Araçları:**
- Debug konsolu (`debug.getInfo()`)
- Cache sistemi
- Error recovery
- Modüler mimari

## ⚠️ Önemli Notlar

1. **AI Tahminleri:** Finansal tavsiye değildir, sadece eğitim amaçlıdır
2. **Internet Bağlantısı:** Haberler ve döviz için gereklidir
3. **Model Dosyaları:** AI tahmin için model dosyaları gereklidir
4. **Port Kullanımı:** 5000 (Flask) ve 5500 (Web) portları kullanılır

## 🐛 Sorun Giderme

### **AI Tahmin Çalışmıyor:**
- Flask sunucusu çalışıyor mu? → `python app.py`
- Model dosyaları yerinde mi? → `models/xgb/` klasörünü kontrol edin
- CORS hatası → Tarayıcı console'unu kontrol edin

### **Dosya Yükleme Çalışmıyor:**
- Dosya formatı doğru mu? → Excel (.xlsx) veya CSV (.csv)
- Dosya boyutu → Çok büyük dosyalar sorun çıkarabilir
- Browser desteği → Modern tarayıcı kullanın

### **Haberler Gelmiyor:**
- Internet bağlantısı → API'lere erişim gerekli
- API limiti → NewsData.io günlük limit kontrolü

## 👨‍💻 Geliştirici

Bu proje modüler JavaScript mimarisi kullanır:
- ES6+ özellikleri
- Async/await yapısı
- Modern fetch API
- Object-oriented design

## 📄 Lisans

Bu proje eğitim amaçlıdır. Ticari kullanım öncesi geliştirici ile iletişime geçin.

---

🚀 **Finance AI ile gelecekteki hisse fiyatlarını tahmin edin!**
