// Tahmin Yönetimi (js/prediction-manager.js)

const PredictionManager = {
  // Tahmin al
  async getPrediction() {
    const date = document.getElementById('predictionDate').value;
    if (!date) {
      alert("Lütfen bir tarih seçin!");
      return;
    }

    const resultDiv = document.getElementById('predictionResult');
    const contentDiv = document.getElementById('predictionContent');
    resultDiv.style.display = 'block';
    
    // Loading göster
    this.showPredictionLoading(contentDiv);

    try {
      const response = await fetch(API_CONFIG.PREDICTION_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          stock: ModalManager.currentStock, 
          date: date 
        })
      });

      const prediction = await response.json();
      
      if (response.ok) {
        this.showPredictionSuccess(contentDiv, prediction, date);
      } else {
        this.showPredictionError(contentDiv, prediction, response);
      }
    } catch (error) {
      this.showConnectionError(contentDiv, error);
    }
  },

  // Loading göster
  showPredictionLoading(contentDiv) {
    contentDiv.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 15px; color: #00c36e;">Tahmin hesaplanıyor...</p>
      </div>
    `;
  },

  // Başarılı tahmin göster
  showPredictionSuccess(contentDiv, prediction, date) {
    contentDiv.innerHTML = `
      <div class="prediction-result">
        <h3>📊 ${ModalManager.currentStock} Tahmin Sonucu</h3>
        <p><strong>Tarih:</strong> ${formatDate(date)}</p>
        <p><strong>Tahmini Kapanış Fiyatı:</strong> 
          <span style="color: #00c36e; font-size: 18px; font-weight: bold;">
            ${prediction.price}₺
          </span>
        </p>
        <p><strong>Beklenen Aralık:</strong> ${prediction.minPrice}₺ - ${prediction.maxPrice}₺</p>
        <p><strong>Model:</strong> ${prediction.model}</p>
        ${this.getPredictionWarning()}
      </div>
    `;
  },

  // API hatası göster
  showPredictionError(contentDiv, prediction, response) {
    contentDiv.innerHTML = `
      <div class="prediction-result error-result">
        <h3>❌ API Hatası</h3>
        <p>Sunucu cevap verdi ama hata içeriyor: ${prediction.error || 'bilinmeyen hata'}</p>
        <pre>HTTP ${response.status} - ${response.statusText}</pre>
        ${this.getErrorDiagnostics()}
      </div>
    `;
  },

  // Bağlantı hatası göster
  showConnectionError(contentDiv, error) {
    contentDiv.innerHTML = `
      <div class="prediction-result error-result">
        <h3>❌ Bağlantı Hatası</h3>
        <p>Sunucuya bağlanırken sorun oluştu:</p>
        <pre>${error.message}</pre>
        <h4>Tanılayıcı Kontrol Listesi:</h4>
        ${this.getConnectionDiagnostics()}
      </div>
    `;
  },

  // Tahmin uyarısı
  getPredictionWarning() {
    return `
      <p style="font-size: 12px; color: #999; margin-top: 15px; padding: 10px; background: #2a2f3a; border-radius: 6px;">
        ⚠️ Bu tahmin finansal tavsiye değildir. Yatırım kararlarınızı alırken profesyonel destek alın.
        Tahminler geçmiş verilere dayanır ve gelecekteki performansı garanti etmez.
      </p>
    `;
  },

  // Hata tanılaması
  getErrorDiagnostics() {
    return `
      <div style="margin-top: 15px; padding: 10px; background: #2a2f3a; border-radius: 6px;">
        <h5>Olası Çözümler:</h5>
        <ul style="margin: 10px 0; padding-left: 20px; font-size: 13px;">
          <li>Flask sunucusunun çalıştığından emin olun</li>
          <li>API endpoint'inin doğru olduğunu kontrol edin</li>
          <li>Seçilen hisse için model bulunup bulunmadığını kontrol edin</li>
        </ul>
      </div>
    `;
  },

  // Bağlantı tanılaması
  getConnectionDiagnostics() {
    return `
      <ul style="margin: 10px 0; padding-left: 20px; font-size: 13px;">
        <li>Flask sunucusu gerçekten açık mı?</li>
        <li>Flask portu <code>5000</code> mü?</li>
        <li>Tarayıcıda <code>http://localhost:5500</code> üzerinden mi açıyorsun?</li>
        <li>Antivirüs veya güvenlik duvarı bağlantıyı kesiyor olabilir mi?</li>
        <li>fetch adresi <code>localhost</code> mu yoksa <code>127.0.0.1</code> mi?</li>
        <li>CORS ayarları doğru mu?</li>
      </ul>
    `;
  },

  // Mock tahmin (test amaçlı)
  async getMockPrediction(date) {
    // Test için sahte tahmin oluştur
    const basePrice = 100 + Math.random() * 50;
    const variation = basePrice * 0.1;
    
    return {
      price: formatNumber(basePrice),
      minPrice: formatNumber(basePrice - variation),
      maxPrice: formatNumber(basePrice + variation),
      model: "LSTM Neural Network (Mock)",
      confidence: Math.round(80 + Math.random() * 15)
    };
  },

  // Toplu tahmin (birden fazla hisse için)
  async getBulkPredictions(stocks, date) {
    const predictions = [];
    
    for (const stock of stocks) {
      try {
        const response = await fetch(API_CONFIG.PREDICTION_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock, date })
        });
        
        if (response.ok) {
          const prediction = await response.json();
          predictions.push({ stock, ...prediction });
        }
      } catch (error) {
        console.error(`${stock} tahmini alınamadı:`, error);
      }
    }
    
    return predictions;
  },

  // Tahmin geçmişi kaydet
  savePredictionHistory(stock, date, prediction) {
    const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    history.push({
      stock,
      date,
      prediction,
      timestamp: new Date().toISOString()
    });
    
    // Son 100 tahmini tut
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    localStorage.setItem('predictionHistory', JSON.stringify(history));
  },

  // Tahmin geçmişini getir
  getPredictionHistory(stock = null) {
    const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    return stock ? history.filter(h => h.stock === stock) : history;
  }
};

// Global fonksiyonlar (eski kodla uyumluluk için)
async function getPrediction() {
  await PredictionManager.getPrediction();
}