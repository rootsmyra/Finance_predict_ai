// Excel Dosya İşleme (js/excel-handler.js)

let csvData = [];

// Dosya seçildiğinde çalışacak fonksiyon
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.name.toLowerCase().includes('tumhisse') && !file.name.toLowerCase().includes('excel')) {
    alert("Lütfen 'tumhisse.xlsx' dosyasını veya benzeri bir Excel dosyasını seçin.");
    return;
  }
  
  loadExcelFile(file);
}

// Excel dosyasını oku
async function loadExcelFile(file) {
  try {
    const loadingInfo = document.getElementById("loadingInfo");
    loadingInfo.style.display = "block";
    loadingInfo.textContent = "📂 Excel dosyası okunuyor...";
    
    // FileReader ile dosyayı oku
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        loadingInfo.textContent = "🔄 Excel verisi işleniyor...";
        
        // ArrayBuffer'ı al
        const arrayBuffer = e.target.result;
        
        // SheetJS ile Excel'i oku
        const workbook = XLSX.read(arrayBuffer, {
            cellStyles: true,
            cellFormulas: true,
            cellDates: true,
            cellNF: true,
            sheetStubs: true
        });
        
        // İlk sheet'i al
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // JSON formatına dönüştür
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: "" 
        });
        
        if (jsonData.length < 2) {
          throw new Error("Excel dosyasında yeterli veri yok");
        }
        
        // İlk satır header, geri kalanı data
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        
        // Verileri obje formatına çevir
        const processedData = rows.map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || "";
          });
          return obj;
        }).filter(row => {
          // Hisse kodu var mı kontrol et
          return row["Hisse"] && row["Hisse"].toString().trim().length > 0;
        });
        
        console.log(`✅ ${processedData.length} hisse verisi işlendi`);
        
        // Verileri global değişkene kaydet
        csvData = processedData;
        
        // StockManager'a verileri yükle
        if (typeof StockManager !== 'undefined') {
          StockManager.loadFromExcel(processedData);
        }
        
        // Excel yükleme butonunu gizle
        document.getElementById('fileUploadSection').style.display = 'none';
        loadingInfo.style.display = "none";
        
      } catch (error) {
        console.error("Excel işleme hatası:", error);
        loadingInfo.innerHTML = "❌ Excel dosyası işlenirken hata oluştu: " + error.message;
        loadingInfo.style.color = "#ff4c4c";
      }
    };
    
    reader.onerror = function() {
      const loadingInfo = document.getElementById("loadingInfo");
      loadingInfo.innerHTML = "❌ Dosya okuma hatası oluştu.";
      loadingInfo.style.color = "#ff4c4c";
    };
    
    // ArrayBuffer olarak oku
    reader.readAsArrayBuffer(file);
    
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    const loadingInfo = document.getElementById("loadingInfo");
    loadingInfo.innerHTML = "❌ Dosya yükleme hatası: " + error.message;
    loadingInfo.style.color = "#ff4c4c";
  }
}

// Excel verilerini export etme
function exportToExcel(data, filename = 'export.xlsx') {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, filename);
    console.log(`✅ Veriler ${filename} olarak export edildi`);
  } catch (error) {
    console.error("Export hatası:", error);
  }
}