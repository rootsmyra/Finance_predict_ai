// Yardımcı Fonksiyonlar (js/utils.js)

// Tarih formatı
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Sayı formatı
function formatNumber(num, decimals = 2) {
  return parseFloat(num).toFixed(decimals);
}

// Hacim formatı
function formatVolume(volume) {
  if (volume >= 1000000) {
    return (volume / 1000000).toFixed(1) + "M";
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(0) + "K";
  }
  return volume.toString();
}

// Renk sınıfı belirleme
function getChangeColor(value) {
  return value >= 0 ? 'green' : 'red';
}

// Rastgele değer üretme
function getRandomChange(baseValue, percentage = 0.05) {
  return baseValue + (baseValue * (Math.random() - 0.5) * percentage);
}

// DOM element oluşturma
function createElement(tag, className = '', innerHTML = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

// Async fetch wrapper
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}

// Loading gösterge
function showLoading(elementId, message = 'Yükleniyor...') {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<div style="text-align: center; padding: 20px; color: #00c36e;">${message}</div>`;
  }
}

// Error gösterge
function showError(elementId, message = 'Hata oluştu') {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<div style="text-align: center; padding: 20px; color: #ff4c4c;">${message}</div>`;
  }
}

// Debounce fonksiyonu
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// String temizleme
function cleanString(str) {
  return str.toString()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^\w]/g, '')
    .toUpperCase()
    .substring(0, 10);
}

// Cache sistemi
const Cache = {
  data: new Map(),
  
  set(key, value, ttl = 300000) { // 5 dakika default TTL
    const expiry = Date.now() + ttl;
    this.data.set(key, { value, expiry });
  },
  
  get(key) {
    const item = this.data.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.data.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  clear() {
    this.data.clear();
  }
};