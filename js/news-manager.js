// Haber Yönetimi (js/news-manager.js)

const NewsManager = {
  allNews: [],
  startIndex: 0,

  // Haberleri yükle
  async loadNews() {
    try {
      let data;
      
      // Önce Türkçe haberler dene
      try {
        data = await fetchData(`https://newsdata.io/api/1/news?apikey=${API_CONFIG.NEWS_API_KEY}&category=business&language=tr`);
      } catch (error) {
        console.warn("Türkçe haberler alınamadı, İngilizce deneniyor...");
        // Türkçe olmadı ise İngilizce dene
        data = await fetchData(`https://newsdata.io/api/1/news?apikey=${API_CONFIG.NEWS_API_KEY}&category=business&language=en`);
      }

      if (data.results && data.results.length > 0) {
        this.allNews = data.results.slice(0, 12);
        this.updateNewsDisplay();
        console.log(`✅ ${this.allNews.length} haber yüklendi`);
      } else {
        this.showNoNews();
      }
    } catch (err) {
      console.error("Haberler yüklenemedi:", err);
      this.showNewsError();
    }
  },

  // Haber görüntüsünü güncelle
  updateNewsDisplay() {
    const container = document.getElementById("newsContainer");
    container.innerHTML = "";
    
    const currentNews = this.allNews.slice(this.startIndex, this.startIndex + 4);

    currentNews.forEach(haber => {
      const kart = this.createNewsCard(haber);
      container.appendChild(kart);
    });
  },

  // Haber kartı oluştur
  createNewsCard(haber) {
    const kart = createElement("div", "news-card");
    
    if (haber.image_url) {
      kart.style.backgroundImage = `url(${haber.image_url})`;
    }

    // Başlığı temizle ve kısalt
    const title = haber.title ? 
      (haber.title.length > 100 ? haber.title.slice(0, 100) + '...' : haber.title) 
      : "Başlık yok";

    kart.innerHTML = `
      <a href="${haber.link}" target="_blank" style="display:block; width:100%; height:100%; text-decoration:none;">
        <div class="news-title">
          ${title}
        </div>
      </a>
    `;

    return kart;
  },

  // Haber slaytını ilerlet
  slideNews() {
    this.startIndex = (this.startIndex + 4) % this.allNews.length;
    this.updateNewsDisplay();
  },

  // Haber bulunamadı mesajı
  showNoNews() {
    const container = document.getElementById("newsContainer");
    container.innerHTML = "<p style='color:#ccc; text-align:center; padding: 40px;'>Hiç haber bulunamadı.</p>";
  },

  // Haber yükleme hatası mesajı
  showNewsError() {
    const container = document.getElementById("newsContainer");
    container.innerHTML = "<p style='color:#ff4c4c; text-align:center; padding: 40px;'>Haberler yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>";
  },

  // Manuel haber yenileme
  async refreshNews() {
    const container = document.getElementById("newsContainer");
    container.innerHTML = "<p style='color:#00c36e; text-align:center; padding: 40px;'>Haberler yenileniyor...</p>";
    await this.loadNews();
  },

  // Belirli kategori haberlerini getir
  async loadCategoryNews(category = 'business') {
    try {
      const data = await fetchData(`https://newsdata.io/api/1/news?apikey=${API_CONFIG.NEWS_API_KEY}&category=${category}&language=tr`);
      
      if (data.results && data.results.length > 0) {
        this.allNews = data.results.slice(0, 12);
        this.startIndex = 0;
        this.updateNewsDisplay();
      }
    } catch (error) {
      console.error(`${category} kategorisi haberler yüklenemedi:`, error);
    }
  },

  // Arama ile haber getir
  async searchNews(query) {
    try {
      const data = await fetchData(`https://newsdata.io/api/1/news?apikey=${API_CONFIG.NEWS_API_KEY}&q=${encodeURIComponent(query)}&language=tr`);
      
      if (data.results && data.results.length > 0) {
        this.allNews = data.results.slice(0, 12);
        this.startIndex = 0;
        this.updateNewsDisplay();
      } else {
        this.showNoNews();
      }
    } catch (error) {
      console.error("Haber arama hatası:", error);
      this.showNewsError();
    }
  }
};

// Global fonksiyonlar (eski kodla uyumluluk için)
async function haberleriYukle() {
  await NewsManager.loadNews();
}

function guncelleHaberler() {
  NewsManager.updateNewsDisplay();
}

function slideHaberler() {
  NewsManager.slideNews();
}