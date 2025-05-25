// Döviz Yönetimi (js/currency-manager.js)

const CurrencyManager = {
  lastUpdateTime: null,

  // Döviz kurlarını yükle
  async loadCurrencies() {
    try {
      const data = await fetchData(API_CONFIG.DOVIZ_API);
      const usdToTry = data.conversion_rates["TRY"];
      
      this.updateCurrencyTable(data, usdToTry);
      this.lastUpdateTime = new Date();
      
      console.log("✅ Döviz kurları güncellendi");
    } catch (error) {
      console.error("Döviz verisi alınamadı:", error);
      this.showCurrencyError();
    }
  },

  // Döviz tablosunu güncelle
  updateCurrencyTable(data, usdToTry) {
    const tbody = document.getElementById("dovizTableBody");
    tbody.innerHTML = "";

    CURRENCY_LIST.forEach(currency => {
      let tlValue;
      if (currency === "USD") {
        tlValue = usdToTry;
      } else {
        const usdToCurrency = data.conversion_rates[currency];
        tlValue = usdToTry / usdToCurrency;
      }
      
      // Rastgele değişim simülasyonu (gerçek veriler için kaldırılabilir)
      const change = getRandomChange(0, 2);
      const changeClass = getChangeColor(change);
      
      const row = this.createCurrencyRow(currency, tlValue, change, changeClass);
      tbody.appendChild(row);
    });
  },

  // Döviz satırı oluştur
  createCurrencyRow(currency, tlValue, change, changeClass) {
    const row = createElement("tr");
    row.innerHTML = `
      <td><strong>${currency}</strong></td>
      <td>${formatNumber(tlValue, 4)} ₺</td>
      <td class="${changeClass}">${change >= 0 ? '+' : ''}${formatNumber(change)}%</td>
    `;
    return row;
  },

  // Döviz hatası göster
  showCurrencyError() {
    const tbody = document.getElementById("dovizTableBody");
    tbody.innerHTML = `
      <tr><td colspan="3" style="text-align: center; color: #ff4c4c; padding: 20px;">
        Döviz verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.
      </td></tr>
    `;
  },

  // Belirli döviz kurunu getir
  async getSpecificRate(fromCurrency, toCurrency = 'TRY') {
    try {
      const data = await fetchData(`https://v6.exchangerate-api.com/v6/c44fe6761db4f1dc700e823d/pair/${fromCurrency}/${toCurrency}`);
      return data.conversion_rate;
    } catch (error) {
      console.error(`${fromCurrency}/${toCurrency} kuru alınamadı:`, error);
      return null;
    }
  },

  // Geçmiş kurları getir (premium API gerekir)
  async getHistoricalRates(date) {
    // Bu özellik premium API gerektirir
    console.log("Geçmiş kurlar premium API gerektirir");
    return null;
  },

  // Döviz hesaplama
  convertCurrency(amount, fromRate, toRate) {
    return (amount / fromRate) * toRate;
  },

  // Son güncelleme zamanını göster
  getLastUpdateInfo() {
    return this.lastUpdateTime ? 
      `Son güncelleme: ${this.lastUpdateTime.toLocaleTimeString('tr-TR')}` : 
      "Henüz güncellenmedi";
  },

  // Manuel yenileme
  async refresh() {
    const tbody = document.getElementById("dovizTableBody");
    tbody.innerHTML = `
      <tr><td colspan="3" style="text-align: center; color: #00c36e; padding: 20px;">
        🔄 Döviz kurları güncelleniyor...
      </td></tr>
    `;
    await this.loadCurrencies();
  }
};

// Global fonksiyonlar (eski kodla uyumluluk için)
async function dovizYukle() {
  await CurrencyManager.loadCurrencies();
}