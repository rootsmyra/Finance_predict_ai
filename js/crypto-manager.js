// ==============================================
// KRIPTO CSV YÜKLEME SİSTEMİ
// ==============================================

// crypto-manager.js'e eklenecek fonksiyonlar:

const CryptoFileManager = {
  // CSV dosyasından kripto verilerini yükle
  async loadFromCSV(file) {
    try {
      const fileContent = await this.readFile(file);
      
      // CSV parse et
      const parsedData = Papa.parse(fileContent, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        encoding: 'utf-8'
      });

      console.log(`📊 ${parsedData.data.length} kripto verisi işlendi`);
      
      // Verileri tabloya yükle
      this.updateTableFromCSV(parsedData.data);
      
    } catch (error) {
      console.error("Kripto CSV yükleme hatası:", error);
      this.showError("Kripto CSV dosyası yüklenirken hata oluştu: " + error.message);
    }
  },

  // Dosya okuma
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsText(file, 'utf-8');
    });
  },

  // CSV verilerini tabloya yükle
  updateTableFromCSV(data) {
    const tbody = document.getElementById("coinTableBody");
    tbody.innerHTML = "";

    data.forEach(coin => {
      if (!coin['İsim'] || !coin['Fiyat']) return;

      // Fiyatı temizle ($107.935,8 → 107935.8)
      const priceStr = coin['Fiyat'].replace(/\$|,/g, '').replace('.', '');
      const price = parseFloat(priceStr) || 0;

      // Değişimi temizle (0,49% → 0.49)
      const changeStr = coin['Değ (24S)'].replace('%', '').replace(',', '.');
      const change = parseFloat(changeStr) || 0;

      const changeClass = change >= 0 ? 'green' : 'red';
      
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${coin['İsim']}</strong> <small style="color: #999;">${coin['Sembol']}</small></td>
        <td>$${this.formatPrice(price)}</td>
        <td class="${changeClass}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</td>
      `;
      tbody.appendChild(row);
    });

    console.log("✅ Kripto tablosu CSV'den güncellendi");
  },

  // Fiyat formatı
  formatPrice(price) {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return price.toFixed(4);
    }
  },

  // Hata göster
  showError(message) {
    const tbody = document.getElementById("coinTableBody");
    tbody.innerHTML = `
      <tr><td colspan="3" style="text-align: center; color: #ff4c4c; padding: 20px;">
        ${message}
      </td></tr>
    `;
  }
};

// ==============================================
// EMTIA EXCEL YÜKLEME SİSTEMİ  
// ==============================================

const CommodityFileManager = {
  // Excel dosyasından emtia verilerini yükle
  async loadFromExcel(file) {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      
      // SheetJS ile Excel oku
      const workbook = XLSX.read(arrayBuffer, {
        cellStyles: true,
        cellFormulas: true,
        cellDates: true
      });
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // JSON'a çevir
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: "" 
      });
      
      console.log(`📊 ${jsonData.length} emtia verisi işlendi`);
      
      // Headers ve data ayır
      const headers = jsonData[0];
      const rows = jsonData.slice(1);
      
      this.updateTableFromExcel(headers, rows);
      
    } catch (error) {
      console.error("Emtia Excel yükleme hatası:", error);
      this.showError("Emtia Excel dosyası yüklenirken hata oluştu: " + error.message);
    }
  },

  // ArrayBuffer olarak oku
  readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsArrayBuffer(file);
    });
  },

  // Excel verilerini tabloya yükle
  updateTableFromExcel(headers, rows) {
    const tbody = document.getElementById("commodityTableBody");
    tbody.innerHTML = "";

    rows.forEach(row => {
      if (!row[0]) return; // Boş satırları atla

      const name = row[0] || '';
      const price = row[1] || '';
      const change = row[2] || '0';

      // Değişimi parse et
      const changeNum = parseFloat(change.toString().replace('%', '')) || 0;
      const changeClass = changeNum >= 0 ? 'green' : 'red';
      
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <td><strong>${name}</strong></td>
        <td>${price}</td>
        <td class="${changeClass}">${changeNum >= 0 ? '+' : ''}${changeNum.toFixed(2)}%</td>
      `;
      tbody.appendChild(tableRow);
    });

    console.log("✅ Emtia tablosu Excel'den güncellendi");
  },

  // Hata göster
  showError(message) {
    const tbody = document.getElementById("commodityTableBody");
    tbody.innerHTML = `
      <tr><td colspan="3" style="text-align: center; color: #ff4c4c; padding: 20px;">
        ${message}
      </td></tr>
    `;
  }
};

// ==============================================
// ENDEKS EXCEL YÜKLEME SİSTEMİ
// ==============================================

const IndexFileManager = {
  // Excel dosyasından endeks verilerini yükle
  async loadFromExcel(file) {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      
      // SheetJS ile Excel oku
      const workbook = XLSX.read(arrayBuffer, {
        cellStyles: true,
        cellFormulas: true,
        cellDates: true
      });
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // JSON'a çevir
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: "" 
      });
      
      console.log(`📊 ${jsonData.length} endeks verisi işlendi`);
      
      // Headers ve data ayır
      const headers = jsonData[0];
      const rows = jsonData.slice(1);
      
      this.updateTableFromExcel(headers, rows);
      
    } catch (error) {
      console.error("Endeks Excel yükleme hatası:", error);
      this.showError("Endeks Excel dosyası yüklenirken hata oluştu: " + error.message);
    }
  },

  // ArrayBuffer olarak oku
  readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsArrayBuffer(file);
    });
  },

  // Excel verilerini tabloya yükle
  updateTableFromExcel(headers, rows) {
    const tbody = document.getElementById("endeksTableBody");
    tbody.innerHTML = "";

    rows.forEach(row => {
      if (!row[0]) return; // Boş satırları atla

      const name = row[0] || '';
      const value = row[1] || '';
      const change = row[2] || '0';

      // Değişimi parse et
      const changeNum = parseFloat(change.toString().replace('%', '')) || 0;
      const changeClass = changeNum >= 0 ? 'green' : 'red';
      
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <td><strong>${name}</strong></td>
        <td>${value}</td>
        <td class="${changeClass}">${changeNum >= 0 ? '+' : ''}${changeNum.toFixed(2)}%</td>
      `;
      tbody.appendChild(tableRow);
    });

    console.log("✅ Endeks tablosu Excel'den güncellendi");
  },

  // Hata göster
  showError(message) {
    const tbody = document.getElementById("endeksTableBody");
    tbody.innerHTML = `
      <tr><td colspan="3" style="text-align: center; color: #ff4c4c; padding: 20px;">
        ${message}
      </td></tr>
    `;
  }
};

// ==============================================
// GLOBAL FONKSİYONLAR (HTML'de kullanılacak)
// ==============================================

function handleCryptoFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.name.toLowerCase().includes('.csv')) {
    alert("Lütfen CSV dosyası seçin.");
    return;
  }
  
  CryptoFileManager.loadFromCSV(file);
}

function handleCommodityFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.name.toLowerCase().includes('.xlsx') && !file.name.toLowerCase().includes('.xls')) {
    alert("Lütfen Excel dosyası seçin.");
    return;
  }
  
  CommodityFileManager.loadFromExcel(file);
}

function handleIndexFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.name.toLowerCase().includes('.xlsx') && !file.name.toLowerCase().includes('.xls')) {
    alert("Lütfen Excel dosyası seçin.");
    return;
  }
  
  IndexFileManager.loadFromExcel(file);
}