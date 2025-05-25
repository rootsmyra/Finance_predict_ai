// Hisse Yönetimi (js/stock-manager.js)

const StockManager = {
  allStockRows: [],
  showingAll: false,
  cache: new Map(),

  // Excel'den gelen verileri yükle
  loadFromExcel(data) {
    try {
      const loadingInfo = document.getElementById("loadingInfo");
      loadingInfo.textContent = "📊 Veriler tabloya aktarılıyor...";
      
      const table = document.getElementById("stockTable");
      table.innerHTML = "";
      this.allStockRows = [];

      // Excel verilerini işle
      data.forEach((row, index) => {
        if (!row || !row["Hisse"]) return;
        
        // Hisse kodunu temizle
        let stockCode = cleanString(row["Hisse"]);
        if (!stockCode) return;
        
        // Sayısal verileri al
        const price = parseFloat(row["Son Fiyat (TL)"]) || 0;
        const changePercent = parseFloat(row["Değişim (%)"]) || 0;
        const changeTL = parseFloat(row["Değişim (TL)"]) || 0;
        const volumeCount = parseInt(row["Hacim (Adet)"]) || 0;

        const isPredictable = PREDICTABLE_STOCKS.includes(stockCode);
        const changeColor = getChangeColor(changePercent);
        const formattedVolume = formatVolume(volumeCount);

        const tableRow = this.createStockRow(stockCode, price, changePercent, changeTL, formattedVolume, isPredictable, changeColor);
        this.allStockRows.push({element: tableRow, isPredictable, stockCode});
      });

      console.log(`📊 İşlenen toplam hisse: ${this.allStockRows.length}`);
      console.log(`🎯 Tahmin edilebilir hisseler: ${this.allStockRows.filter(r => r.isPredictable).map(r => r.stockCode).join(', ')}`);

      this.showInitialStocks();
      document.getElementById('fileUploadSection').style.display = 'none';
      loadingInfo.style.display = "none";
      
      console.log(`✅ ${this.allStockRows.length} hisse tabloya yüklendi`);
      
    } catch (error) {
      console.error("Tablo yükleme hatası:", error);
      showError("loadingInfo", "Veriler tabloya yüklenirken hata oluştu: " + error.message);
    }
  },

  // Hisse satırı oluştur
  createStockRow(stockCode, price, changePercent, changeTL, formattedVolume, isPredictable, changeColor) {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("hisse-satiri");
    if (isPredictable) {
      tableRow.classList.add("predictable-row");
    }
    tableRow.setAttribute("data-stock", stockCode);
    tableRow.setAttribute("onclick", `ModalManager.openStockDetail('${stockCode}', ${isPredictable})`);
    tableRow.innerHTML = `
      <td><strong>${stockCode}</strong></td>
      <td class="${changeColor}">${formatNumber(price)}₺</td>
      <td class="${changeColor}">${changePercent >= 0 ? '+' : ''}${formatNumber(changePercent)}%</td>
      <td class="${changeColor}">${changeTL >= 0 ? '+' : ''}${formatNumber(changeTL)}₺</td>
      <td>${formattedVolume}</td>
    `;
    return tableRow;
  },

  // İlk hisseleri göster (sadece tahmin edilebilir)
  showInitialStocks() {
    const table = document.getElementById("stockTable");
    table.innerHTML = "";
    
    // Tahmin edilebilir hisseleri filtrele ve göster
    const predictableRows = this.allStockRows.filter(row => row.isPredictable);
    
    console.log(`📊 Tahmin edilebilir hisse sayısı: ${predictableRows.length}`);
    console.log(`📊 Toplam hisse sayısı: ${this.allStockRows.length}`);
    
    predictableRows.forEach(row => {
      table.appendChild(row.element);
    });
    
    // Eğer tahmin edilebilir hisseler yoksa, ilk 10 hisseyi göster
    if (predictableRows.length === 0) {
      const firstTenRows = this.allStockRows.slice(0, 10);
      firstTenRows.forEach(row => {
        table.appendChild(row.element);
      });
      console.log("⚠️ Tahmin edilebilir hisse bulunamadı, ilk 10 hisse gösteriliyor");
    }
    
    // Buton durumlarını ayarla
    const totalRows = this.allStockRows.length;
    const visibleRows = predictableRows.length > 0 ? predictableRows.length : Math.min(10, totalRows);
    
    if (totalRows > visibleRows) {
      document.getElementById("gosterBtn").style.display = "inline-block";
    } else {
      document.getElementById("gosterBtn").style.display = "none";
    }
    
    document.getElementById("azGosterBtn").style.display = "none";
    this.showingAll = false;
  },

  // Tüm hisseleri göster
  showAllStocks() {
    const table = document.getElementById("stockTable");
    table.innerHTML = "";
    
    this.allStockRows.forEach(row => {
      table.appendChild(row.element);
    });
    
    document.getElementById("gosterBtn").style.display = "none";
    document.getElementById("azGosterBtn").style.display = "inline-block";
    this.showingAll = true;
  },

  // Hisse arama
  searchStocks(searchTerm) {
    const table = document.getElementById("stockTable");
    table.innerHTML = "";
    
    if (!searchTerm) {
      if (this.showingAll) {
        this.showAllStocks();
      } else {
        this.showInitialStocks();
      }
      return;
    }
    
    const filteredRows = this.allStockRows.filter(row => 
      row.stockCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    filteredRows.forEach(row => {
      table.appendChild(row.element);
    });
    
    document.getElementById("gosterBtn").style.display = "none";
    document.getElementById("azGosterBtn").style.display = "none";
  },

  // API'den hisse verileri çek (Finnhub)
  async fetchStockData() {
    const table = document.getElementById("stockTable");
    table.innerHTML = "";

    const allStocks = [...STOCK_GROUPS.grup1, ...STOCK_GROUPS.grup2];

    for (let i = 0; i < allStocks.length; i++) {
      const kod = allStocks[i];
      const API_KEY = STOCK_GROUPS.grup1.includes(kod) ? FINNHUB_KEYS.API_KEY_1 : FINNHUB_KEYS.API_KEY_2;
      const url = `https://finnhub.io/api/v1/quote?symbol=${kod}.IS&token=${API_KEY}`;

      let fiyat = "-", yuksek = "-", dusuk = "-", degisim = "-", renk = "grey";

      try {
        // Cache kontrol et
        const cacheKey = `stock_${kod}`;
        const cachedData = Cache.get(cacheKey);
        
        if (cachedData) {
          ({ fiyat, yuksek, dusuk, degisim, renk } = cachedData);
        } else {
          const data = await fetchData(url);

          if (data && data.c) {
            fiyat = formatNumber(data.c);
            yuksek = data.h ? formatNumber(data.h) : "-";
            dusuk = data.l ? formatNumber(data.l) : "-";
            const onceki = data.pc;
            if (onceki && onceki > 0) {
              const fark = ((data.c - onceki) / onceki * 100);
              degisim = formatNumber(fark);
              renk = getChangeColor(fark);
            }

            // Cache'e kaydet
            const stockData = { fiyat, yuksek, dusuk, degisim, renk };
            Cache.set(cacheKey, stockData, 300000); // 5 dakika
          }
        }

      } catch (e) {
        console.warn(`${kod} verisi alınamadı:`, e);
        // Cache'den al
        const cacheKey = `stock_${kod}`;
        const cachedData = Cache.get(cacheKey);
        if (cachedData) {
          ({ fiyat, yuksek, dusuk, degisim, renk } = cachedData);
        }
      }

      const satir = document.createElement("tr");
      satir.style.display = i < 5 ? "" : "none";
      satir.classList.add("hisse-satiri");
      satir.setAttribute("onclick", `ModalManager.openStockDetail('${kod}')`);
      satir.innerHTML = `
        <td>${kod}</td>
        <td class="${renk}">${fiyat}₺</td>
        <td>${yuksek}₺</td>
        <td>${dusuk}₺</td>
        <td class="${renk}">${degisim !== "-" ? degisim + "%" : "-"}</td>
      `;
      table.appendChild(satir);
    }
  }
};

// Global fonksiyonlar (eski kodla uyumluluk için)
function dahaFazlaGoster() {
  StockManager.showAllStocks();
}

function dahaAzGoster() {
  StockManager.showInitialStocks();
}