// Ana Uygulama (js/main.js)

class FinanceApp {
  constructor() {
    this.isInitialized = false;
    this.updateIntervals = {};
  }

  // Uygulamayı başlat
  async init() {
    if (this.isInitialized) return;

    console.log("🚀 Finance-AI Uygulaması başlatılıyor...");

    try {
      // Event listener'ları ekle
      this.setupEventListeners();
      
      // Sayfa yüklendiğinde verileri çek
      await this.loadInitialData();
      
      // Otomatik güncellemeleri başlat
      this.startAutoUpdates();
      
      this.isInitialized = true;
      console.log("✅ Uygulama başarıyla başlatıldı");
      
    } catch (error) {
      console.error("❌ Uygulama başlatılırken hata oluştu:", error);
    }
  }

  // İlk verileri yükle
  async loadInitialData() {
    console.log("📊 İlk veriler yükleniyor...");
    
    // Excel dosyası yüklenmesini bekle (manuel yükleme)
    console.log("📂 Excel dosyasını yüklemek için 'Excel Dosyası Yükle' butonuna tıklayın.");
    
    // Diğer verileri paralel olarak yükle
    const loadPromises = [
      NewsManager.loadNews().catch(e => console.warn("Haberler yüklenemedi:", e)),
      CurrencyManager.loadCurrencies().catch(e => console.warn("Döviz yüklenemedi:", e)),
      IndexManager.loadIndexes().catch(e => console.warn("Endeksler yüklenemedi:", e)),
      CommodityManager.loadCommodities().catch(e => console.warn("Emtia yüklenemedi:", e)),
      CryptoManager.loadCryptos().catch(e => console.warn("Kripto yüklenemedi:", e))
    ];

    await Promise.allSettled(loadPromises);
    console.log("✅ İlk veri yükleme tamamlandı");
  }

  // Event listener'ları kur
  setupEventListeners() {
    // Arama input'u
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      const debouncedSearch = debounce((e) => {
        StockManager.searchStocks(e.target.value);
      }, 300);
      
      searchInput.addEventListener('input', debouncedSearch);
    }

    // Modal kapatma (ESC tuşu)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        ModalManager.closeModal();
      }
    });

    // Window resize
    window.addEventListener('resize', () => {
      ModalManager.adjustModalSize();
    });

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.handlePageVisible();
      } else {
        this.handlePageHidden();
      }
    });

    console.log("✅ Event listener'lar kuruldu");
  }

  // Otomatik güncellemeleri başlat
  startAutoUpdates() {
    // Haber slaytı
    this.updateIntervals.newsSlide = setInterval(() => {
      NewsManager.slideNews();
    }, INTERVALS.NEWS_SLIDE);

    // Döviz güncelleme (10 dakikada bir)
    this.updateIntervals.currency = setInterval(() => {
      CurrencyManager.loadCurrencies();
    }, INTERVALS.CURRENCY_UPDATE);

    // Endeks güncelleme (30 dakikada bir)
    this.updateIntervals.index = setInterval(() => {
      IndexManager.loadIndexes();
    }, INTERVALS.INDEX_UPDATE);

    // Emtia güncelleme (30 dakikada bir)
    this.updateIntervals.commodity = setInterval(() => {
      CommodityManager.loadCommodities();
    }, INTERVALS.COMMODITY_UPDATE);

    // Kripto güncelleme (5 dakikada bir)
    this.updateIntervals.crypto = setInterval(() => {
      CryptoManager.loadCryptos();
    }, INTERVALS.CRYPTO_UPDATE);

    console.log("✅ Otomatik güncellemeler başlatıldı");
  }

  // Sayfa görünür olduğunda
  handlePageVisible() {
    console.log("👁️ Sayfa görünür oldu, veriler yenileniyor...");
    
    // Tüm verileri yenile
    CurrencyManager.loadCurrencies();
    IndexManager.loadIndexes();
    CommodityManager.loadCommodities();
    CryptoManager.loadCryptos();
  }

  // Sayfa gizli olduğunda
  handlePageHidden() {
    console.log("🙈 Sayfa gizlendi");
    // Gerekirse bazı işlemleri durdur
  }

  // Otomatik güncellemeleri durdur
  stopAutoUpdates() {
    Object.values(this.updateIntervals).forEach(interval => {
      clearInterval(interval);
    });
    this.updateIntervals = {};
    console.log("⏹️ Otomatik güncellemeler durduruldu");
  }

  // Uygulamayı yeniden başlat
  async restart() {
    this.stopAutoUpdates();
    this.isInitialized = false;
    await this.init();
  }

  // Hata durumunda uygulamayı kurtarma
  async recover() {
    console.log("🔄 Uygulama kurtarma modunda...");
    
    try {
      // Cache'i temizle
      Cache.clear();
      
      // Modülleri yeniden başlat
      await this.loadInitialData();
      
      console.log("✅ Uygulama başarıyla kurtarıldı");
    } catch (error) {
      console.error("❌ Kurtarma işlemi başarısız:", error);
      alert("Uygulama hatası oluştu. Sayfayı yenilemek gerekebilir.");
    }
  }

  // Performans metrikleri
  getPerformanceMetrics() {
    return {
      cacheSize: Cache.data.size,
      updateIntervals: Object.keys(this.updateIntervals).length,
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
      } : 'N/A'
    };
  }

  // Debug bilgileri
  getDebugInfo() {
    return {
      isInitialized: this.isInitialized,
      activeIntervals: Object.keys(this.updateIntervals),
      lastUpdate: new Date().toISOString(),
      ...this.getPerformanceMetrics()
    };
  }
}

// Global uygulama instance'ı
const app = new FinanceApp();

// DOM yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', async () => {
  await app.init();
});

// Sayfa yüklendiğinde (fallback)
window.addEventListener('load', async () => {
  if (!app.isInitialized) {
    await app.init();
  }
});

// Hata yakalama
window.addEventListener('error', (event) => {
  console.error('Global hata:', event.error);
  
  // Kritik hatalar için kurtarma
  if (event.error.message.includes('fetch') || 
      event.error.message.includes('network')) {
    console.log("🔄 Ağ hatası tespit edildi, kurtarma başlatılıyor...");
    setTimeout(() => app.recover(), 2000);
  }
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', (event) => {
  console.error('Yakalanmamış promise hatası:', event.reason);
  event.preventDefault();
});

// Global debug fonksiyonları (development için)
window.debug = {
  app: app,
  stockManager: StockManager,
  newsManager: NewsManager,
  currencyManager: CurrencyManager,
  indexManager: IndexManager,
  commodityManager: CommodityManager,
  cryptoManager: CryptoManager,
  modalManager: ModalManager,
  chartManager: ChartManager,
  predictionManager: PredictionManager,
  cache: Cache,
  getInfo: () => app.getDebugInfo(),
  restart: () => app.restart(),
  recover: () => app.recover()
};

// Console'da debug bilgisi göster
console.log(`
🔧 DEBUG MODE ACTIVE
Kullanılabilir komutlar:
- debug.getInfo() - Uygulama bilgileri
- debug.restart() - Uygulamayı yeniden başlat
- debug.recover() - Kurtarma modu
- debug.cache.clear() - Cache'i temizle
- debug.app - Ana uygulama objesi
- debug.[manager] - Modül objelerine erişim
`);

// Version info
console.log("📱 Finance-AI v2.0 - Modüler Mimari");
console.log("🔗 Tüm modüller yüklendi ve entegre edildi");