// Modal Yönetimi (js/modal-manager.js)

const ModalManager = {
  currentStock: "",
  canPredict: false,

  // Hisse detay modalını aç
  openStockDetail(stockSymbol, isPredictable = false) {
    this.currentStock = stockSymbol;
    this.canPredict = isPredictable;
    
    document.getElementById('stockTitle').textContent = 
      `${stockSymbol} - Hisse Analizi ${isPredictable ? '(Tahmin Mevcut)' : ''}`;
    document.getElementById('stockModal').style.display = 'block';
    
    const predictionButtons = document.getElementById('predictionButtons');
    if (isPredictable) {
      predictionButtons.style.display = 'flex';
    } else {
      predictionButtons.style.display = 'none';
    }
    
    this.resetModalState();
    
    // Grafik yükle
    if (typeof ChartManager !== 'undefined') {
      ChartManager.loadChart(stockSymbol);
    }
  },

  // Modalı kapat
  closeModal() {
    document.getElementById('stockModal').style.display = 'none';
    this.resetModalState();
  },

  // Modal state'ini sıfırla
  resetModalState() {
    document.getElementById('predictionInputArea').style.display = 'none';
    document.getElementById('predictionResult').style.display = 'none';
  },

  // Tarih tahmin alanını göster
  showDatePrediction() {
    document.getElementById('predictionInputArea').style.display = 'block';
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);

    const dateInput = document.getElementById('predictionDate');
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];

    document.getElementById('maxDateInfo').textContent = 
      `📅 En geç ${maxDate.toLocaleDateString('tr-TR')} tarihine kadar tahmin yapılabilir.`;
  },

  // Modal dışı tıklama kontrolü
  handleOutsideClick(event) {
    const modal = document.getElementById('stockModal');
    if (event.target === modal) {
      this.closeModal();
    }
  },

  // ESC tuşu ile kapatma
  handleKeyPress(event) {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  },

  // Modal boyutunu ayarla
  adjustModalSize() {
    const modal = document.querySelector('.modal-content');
    const windowHeight = window.innerHeight;
    
    if (windowHeight < 700) {
      modal.style.height = '90vh';
      modal.style.top = '5%';
      modal.style.transform = 'none';
    } else {
      modal.style.height = '60vh';
      modal.style.top = '50%';
      modal.style.transform = 'translateY(-50%)';
    }
  },

  // Modal animasyonu
  animateModal(show = true) {
    const modal = document.getElementById('stockModal');
    const content = document.querySelector('.modal-content');
    
    if (show) {
      modal.style.display = 'block';
      modal.style.opacity = '0';
      content.style.transform = 'translateY(-50%) scale(0.8)';
      
      // Animasyon
      setTimeout(() => {
        modal.style.opacity = '1';
        content.style.transform = 'translateY(-50%) scale(1)';
      }, 10);
    } else {
      modal.style.opacity = '0';
      content.style.transform = 'translateY(-50%) scale(0.8)';
      
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  },

  // Modal içeriğini temizle
  clearModalContent() {
    document.getElementById('modal-graph-container').innerHTML = '';
    document.getElementById('predictionContent').innerHTML = '';
  },

  // Hisse bilgilerini göster
  displayStockInfo(stockData) {
    const infoContainer = document.createElement('div');
    infoContainer.className = 'stock-info';
    infoContainer.innerHTML = `
      <div style="display: flex; gap: 20px; margin: 15px 0; padding: 15px; background: #262d3a; border-radius: 8px;">
        <div>
          <strong>Son Fiyat:</strong> ${stockData.price || '-'}₺
        </div>
        <div>
          <strong>Değişim:</strong> 
          <span class="${getChangeColor(stockData.change || 0)}">
            ${stockData.change || 0}%
          </span>
        </div>
        <div>
          <strong>Hacim:</strong> ${stockData.volume || '-'}
        </div>
      </div>
    `;
    
    const container = document.getElementById('modal-graph-container');
    container.insertBefore(infoContainer, container.firstChild);
  }
};

// Global fonksiyonlar (eski kodla uyumluluk için)
function openStockDetail(stockSymbol, isPredictable) {
  ModalManager.openStockDetail(stockSymbol, isPredictable);
}

function closeModal() {
  ModalManager.closeModal();
}

function showDatePrediction() {
  ModalManager.showDatePrediction();
}

// Event listener'lar
document.addEventListener('DOMContentLoaded', function() {
  // Modal dışı tıklama
  window.addEventListener('click', (event) => {
    ModalManager.handleOutsideClick(event);
  });
  
  // ESC tuşu
  document.addEventListener('keydown', (event) => {
    ModalManager.handleKeyPress(event);
  });
  
  // Pencere boyutu değişimi
  window.addEventListener('resize', () => {
    ModalManager.adjustModalSize();
  });
});