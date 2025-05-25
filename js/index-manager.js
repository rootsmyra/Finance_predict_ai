// Endeks Yönetimi (js/index-manager.js)

const IndexManager = {
  // Endeks verilerini yükle
  async loadIndexes() {
    try {
      const tbody = document.getElementById("endeksTableBody");
      tbody.innerHTML = "";

      INDEX_LIST.forEach(endeks => {
        // Rastgele küçük değişiklikler ekle (gerçek API bağlantısı için değiştirilebilir)
        const currentValue = Math.round(getRandomChange(endeks.value, 0.02));
        const currentChange = getRandomChange(endeks.change, 0.5);
        const changeClass = getChangeColor(currentChange);
        
        const row = this.createIndexRow(endeks.name, currentValue, currentChange, changeClass);
        tbody.appendChild(row);
      });

      console.log("✅ Endeks verileri güncellendi");
    } catch (error) {
      console.error("Endeks verileri yüklenemedi:", error);
      this.showIndexError();
    }
  },

  // Endeks satırı oluştur
  createIndexRow(name, value, change, changeClass) {
    const row = createElement("tr");
    row.innerHTML = `
      <td><strong>${name}</strong></td>
      <td>${value.toLocaleString('tr-TR')}</td>
      <td class="${changeClass}">${change >= 0 ? '+' : ''}${formatNumber(change)}%</td>
    `;
    return row;
  },

  // Endeks hatası göster
  showIndexError() {
    const tbody = document.getElementById("endeksTableBody");
    tbody.innerHTML = `
      <tr><td colspan="3" style="text-align: center; color: #ff4c4c; padding: 20px;">
        Endeks verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.
      </td></tr>
    `;
  },

  // Gerçek API'den endeks verilerini çek (gelecekte implementasyon için)
  async fetchRealIndexData() {
    try {
      // Burada gerçek endeks API'si kullanılabilir
      // Örnek: Alpha Vantage, Financial Modeling Prep, vb.
      
      // Şimdilik simulated data kullanıyoruz
      console.log("Gerçek endeks API'si henüz implementasyonda değil");
      return this.getSimulatedIndexData();
    } catch (error) {
      console.error("Gerçek endeks verisi alınamadı:", error);
      return this.getSimulatedIndexData();
    }
  },

  // Simulated endeks verisi
  getSimulatedIndexData() {
    return INDEX_LIST.map(endeks => ({
      ...endeks,
      value: Math.round(getRandomChange(endeks.value, 0.02)),
      change: getRandomChange(endeks.change, 0.5)
    }));
  },

  // Belirli endeksin detayını getir
  getIndexDetail(indexCode) {
    return INDEX_LIST.find(index => index.code === indexCode);
  },

  // Endeks performans karşılaştırması
  compareIndexes(indexCodes) {
    return indexCodes.map(code => {
      const index = this.getIndexDetail(code);
      return {
        name: index?.name || code,
        performance: index?.change || 0
      };
    }).sort((a, b) => b.performance - a.performance);
  },

  // Manuel yenileme
  async refresh() {
    const tbody = document.getElementById("endeksTableBody");
    tbody.innerHTML = `
      <tr><td colspan="3" style="text-align: center; color: #00c36e; padding: 20px;">
        🔄 Endeks verileri güncelleniyor...
      </td></tr>
    `;
    await this.loadIndexes();
  },

  // JSON dosyasından endeks verilerini yükle (mevcut sistem ile uyumluluk için)
  async loadFromJSON() {
    try {
      const response = await fetch("public/endeksler.json");
      const endeksVerisi = await response.json();

      const tbody = document.getElementById("endeksTableBody");
      tbody.innerHTML = "";

      endeksVerisi.forEach(endeks => {
        const row = createElement("tr");
        row.innerHTML = `
          <td><strong>${endeks.ad}</strong></td>
          <td>${endeks.fiyat ? `${endeks.fiyat}` : "-"}</td>
          <td class="grey">-</td>
        `;
        tbody.appendChild(row);
      });

      console.log("✅ JSON'dan endeks verileri yüklendi");
    } catch (error) {
      console.error("JSON endeks verisi alınamadı:", error);
      await this.loadIndexes(); // Fallback olarak simulated data kullan
    }
  }
};

// Global fonksiyonlar (eski kodla uyumluluk için)
async function endeksYukle() {
  await IndexManager.loadIndexes();
}

function endeksDahaFazlaGoster() {
  IndexManager.showAllIndexes();
}

function endeksDahaAzGoster() {
  IndexManager.showInitialIndexes();
}