// Grafik Yönetimi (js/chart-manager.js)

const ChartManager = {
  // TradingView grafik yükle
  loadChart(stockCode) {
    const container = document.getElementById("modal-graph-container");

    if (!container) {
      console.error("Grafik container bulunamadı: modal-graph-container");
      return;
    }

    // Önce container'ı temizle
    container.innerHTML = "";

    // Yeni div oluştur
    const grafikDiv = document.createElement("div");
    grafikDiv.id = "tradingview-widget";
    grafikDiv.style.width = "100%";
    grafikDiv.style.height = "300px";
    container.appendChild(grafikDiv);

    // TradingView script zaten varsa doğrudan yükle
    if (typeof TradingView !== "undefined") {
      this.createWidget(stockCode);
      return;
    }

    // Script'i dinamik yükle
    this.loadTradingViewScript(stockCode);
  },

  // TradingView script'ini yükle
  loadTradingViewScript(stockCode) {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.onload = () => this.createWidget(stockCode);
    script.onerror = () => this.showChartError();
    document.head.appendChild(script);
  },

  // TradingView widget oluştur
  createWidget(stockCode) {
    try {
      new TradingView.widget({
        container_id: "tradingview-widget",
        symbol: `BIST:${stockCode}`,
        width: "100%",
        height: 300,
        interval: "D",
        theme: "dark",
        style: "1",
        locale: "tr",
        hide_top_toolbar: true,
        hide_legend: false,
        save_image: false,
        backgroundColor: "#1a1f29",
        gridColor: "#262d3a",
        scale: 0
      });
      console.log(`✅ ${stockCode} grafiği yüklendi`);
    } catch (error) {
      console.error("TradingView widget hatası:", error);
      this.showChartError();
    }
  },

  // Grafik hatası göster
  showChartError() {
    const container = document.getElementById("modal-graph-container");
    if (container) {
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 300px; background: #262d3a; border-radius: 8px; color: #ff4c4c;">
          📈 Grafik yüklenemedi. Lütfen internet bağlantınızı kontrol edin.
        </div>
      `;
    }
  },

  // Alternatif grafik kütüphanesi (Chart.js ile basit grafik)
  createSimpleChart(stockCode, data = null) {
    const container = document.getElementById("modal-graph-container");
    container.innerHTML = `
      <canvas id="simpleChart" width="100%" height="300"></canvas>
    `;

    // Örnek veri oluştur (gerçek veriler için değiştirilebilir)
    const chartData = data || this.generateSampleData();
    
    // Canvas context al
    const canvas = document.getElementById('simpleChart');
    const ctx = canvas.getContext('2d');
    
    this.drawSimpleLineChart(ctx, chartData, stockCode);
  },

  // Basit çizgi grafik çiz
  drawSimpleLineChart(ctx, data, title) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Temizle
    ctx.clearRect(0, 0, width, height);
    
    // Arka plan
    ctx.fillStyle = '#262d3a';
    ctx.fillRect(0, 0, width, height);
    
    // Grid çiz
    this.drawGrid(ctx, width, height);
    
    // Veri çizgisi çiz
    this.drawDataLine(ctx, data, width, height);
    
    // Başlık
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Inter';
    ctx.fillText(`${title} - Son 30 Gün`, 20, 30);
  },

  // Grid çiz
  drawGrid(ctx, width, height) {
    ctx.strokeStyle = '#3c4659';
    ctx.lineWidth = 1;
    
    // Dikey çizgiler
    for (let i = 0; i < width; i += width / 10) {
      ctx.beginPath();
      ctx.moveTo(i, 50);
      ctx.lineTo(i, height - 50);
      ctx.stroke();
    }
    
    // Yatay çizgiler
    for (let i = 50; i < height - 50; i += (height - 100) / 5) {
      ctx.beginPath();
      ctx.moveTo(50, i);
      ctx.lineTo(width - 50, i);
      ctx.stroke();
    }
  },

  // Veri çizgisi çiz
  drawDataLine(ctx, data, width, height) {
    if (!data || data.length === 0) return;
    
    const margin = 50;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const valueRange = maxValue - minValue;
    
    ctx.strokeStyle = '#00c36e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = margin + (index / (data.length - 1)) * chartWidth;
      const y = margin + chartHeight - ((value - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  },

  // Örnek veri oluştur
  generateSampleData() {
    const data = [];
    let baseValue = 100;
    
    for (let i = 0; i < 30; i++) {
      baseValue += (Math.random() - 0.5) * 5;
      data.push(Math.max(baseValue, 50)); // Minimum 50
    }
    
    return data;
  },

  // Grafik türünü değiştir
  changeChartType(type) {
    console.log(`Grafik türü ${type} olarak değiştirildi`);
    // TradingView widget'ını yeniden yapılandır
  },

  // Zaman dilimini değiştir
  changeTimeframe(interval) {
    console.log(`Zaman dilimi ${interval} olarak değiştirildi`);
    // TradingView widget'ını güncelle
  }
};

// Global fonksiyonlar (eski kodla uyumluluk için)
function grafikModalGoster(hisseKodu) {
  ChartManager.loadChart(hisseKodu);
}

function loadWidget(hisseKodu) {
  ChartManager.createWidget(hisseKodu);
}