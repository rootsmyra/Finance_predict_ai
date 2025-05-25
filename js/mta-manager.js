// Emtia Yönetimi (js/mta-manager.js)

const CommodityManager = {
  // Emtia verilerini yükle
  async loadCommodities() {
    try {
      const tbody = document.getElementById("commodityTableBody");
      tbody.innerHTML = "";

      COMMODITY_LIST.forEach(commodity => {
        // Rastgele küçük değişiklikler ekle (gerçek API için değiştirilebilir)
        const currentValue = getRandomChange(commodity.value, 0.02);
        const currentChange = getRandomChange(commodity.change, 0.5);
        const changeClass = getChangeColor(currentChange);
        
        const row = this.createCommodityRow(commodity.name, currentValue, commodity.unit, currentChange, changeClass);
        tbody.appendChild(row);
      });

      console.log("✅ Emtia verileri güncellendi");
    } catch (error) {
      console.error("Emtia verileri yüklenemedi:", error);
      this.showCommodityError();
    }
  },

  // Emtia satırı oluştur
  createCommodityRow(name, value, unit, change, changeClass) {
    const row = createElement("tr");
    
    // Birim gösterimini düzenle
    let formattedValue;
    if (unit.includes('$')) {
      formattedValue = `$${formatNumber(value)}`;
    } else if (unit.includes('¢')) {
      formattedValue = `${formatNumber(value)}¢`;
    } else {
      formattedValue = formatNumber(value);
    }
    
    // Birimi ayrı göster
    const unitDisplay = unit.replace(/\$|¢/g, '').replace(/^\//, '');
    
    row.innerHTML = `
      <td><strong>${name}</strong></td>
      <td>${formattedValue} <small style="color: #999;">${unitDisplay}</small></td>
      <td class="${changeClass}">${change >= 0 ? '+' : ''}${formatNumber(change)}%</td>
    `;
    return row;
  },

  // Emtia hatası göster
  showCommodityError() {
    const tbody = document.getElementById("commodityTableBody");
    tbody.innerHTML = `
      <tr><td colspan="3" style="text-align: center; color: #ff4c4c; padding: 20px;">
        Emtia verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.
      </td></tr>
    `;
  },

  // Gerçek API'den emtia verilerini çek (gelecekte implementasyon için)
  async fetchRealCommodityData() {
    try {
      // Burada investing.com scraping veya Yahoo Finance API kullanılabilir
      // Alternatif: Alpha Vantage, Quandl, Twelve Data gibi servisler
      
      // Şimdilik simulated data kullanıyoruz
      console.log("Gerçek emtia API'si henüz implementasyonda değil");
      return this.getSimulatedCommodityData();
    } catch (error) {
      console.error("Gerçek emtia verisi alınamadı:", error);
      return this.getSimulatedCommodityData();
    }
  },

  // Simulated emtia verisi
  getSimulatedCommodityData() {
    return COMMODITY_LIST.map(commodity => ({
      ...commodity,
      value: getRandomChange(commodity.value, 0.02),
      change: getRandomChange(commodity.change, 0.5)
    }));
  },

  // Belirli emtianın detayını getir
  getCommodityDetail(commodityCode) {
    return COMMODITY_LIST.find(commodity => commodity.code === commodityCode);
  },

  // Emtia kategorileri
  getCommodityByCategory() {
    return {
      metals: COMMODITY_LIST.filter(c => ['GOLD', 'SILVER', 'COPPER'].includes(c.code)),
      energy: COMMODITY_LIST.filter(c => ['CRUDE', 'BRENT', 'NATGAS'].includes(c.code)),
      agriculture: COMMODITY_LIST.filter(c => ['WHEAT', 'COFFEE'].includes(c.code))
    };
  },

  // Manuel yenileme
  async refresh() {
    const tbody = document.getElementById("commodityTableBody");
    tbody.innerHTML = `
      <tr><td colspan="3" style="text-align: center; color: #00c36e; padding: 20px;">
        🔄 Emtia verileri güncelleniyor...
      </td></tr>
    `;
    await this.loadCommodities();
  },

  // Emtia trend analizi
  getTrendAnalysis() {
    const categories = this.getCommodityByCategory();
    
    return {
      metals: {
        count: categories.metals.length,
        avgChange: categories.metals.reduce((sum, c) => sum + c.change, 0) / categories.metals.length
      },
      energy: {
        count: categories.energy.length,
        avgChange: categories.energy.reduce((sum, c) => sum + c.change, 0) / categories.energy.length
      },
      agriculture: {
        count: categories.agriculture.length,
        avgChange: categories.agriculture.reduce((sum, c) => sum + c.change, 0) / categories.agriculture.length
      }
    };
  }
};

// Global fonksiyonlar (eski kodla uyumluluk için)
async function emtiaYukle() {
  await CommodityManager.loadCommodities();
}

async function mtaYukle() {
  await CommodityManager.loadCommodities();
}