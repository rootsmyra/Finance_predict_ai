// Konfigürasyon Dosyası (js/config.js)

// API Keys
const API_CONFIG = {
  NEWS_API_KEY: "pub_23ca45f5df0142c4b9323fed33d707cb",
  DOVIZ_API: "https://v6.exchangerate-api.com/v6/c44fe6761db4f1dc700e823d/latest/USD",
  PREDICTION_API: "http://localhost:5000/predict"
};

// Finnhub API Keys
const FINNHUB_KEYS = {
  API_KEY_1: "d0oetkhr01qsib2c804gd0oetkhr01qsib2c8050",
  API_KEY_2: "d0oetnpr01qsib2c80ogd0oetnpr01qsib2c80p0"
};

// Tahmin edilebilir hisseler
const PREDICTABLE_STOCKS = [
  "ASELS", "BIMAS", "EREGL", "FROTO", "KOZAL", 
  "KRDMD", "SASA", "SISE", "THYAO", "TUPRS"
];

// BIST 100 Hisse Grupları
const STOCK_GROUPS = {
  grup1: [
    "ANHYT", "ANSGR", "ARCLK", "ARDYZ", "ASELS", "ASTOR", "AVPGY", "BERA", "BIMAS", "BRISA",
    "BRMEN", "CANTE", "CCOLA", "CIMSA", "CLEBI", "DOAS", "EKGYO", "EKIZ", "ENJSA", "ENKAI",
    "EREGL", "FROTO", "GARAN", "GUBRF", "HALKB", "HEKTS", "ISCTR", "ISMEN", "IZFAS", "KARSN",
    "KCHOL", "KLSER", "KMPUR", "KONTR", "KONYA", "KORDS", "KRDMD", "KUTPO"
  ],
  grup2: [
    "LIDFA", "LKMNH", "MAKIM", "MAVI", "MEPET", "MERKO", "MIATK", "MPARK", "ODAS", "OTKAR",
    "OYAKC", "PARSN", "PASEU", "PETKM", "PGSUS", "RALYH", "REEDR", "RYGYO", "SAHOL", "SASA",
    "SELEC", "SISE", "SKBNK", "SMRTG", "SNKRN", "SOKM", "TABGD", "TCELL", "THYAO", "TMSN",
    "TOASO", "TRGYO", "TSKB", "TTKOM", "TTRAK", "TUKAS", "TUPRS", "TURSG", "ULKER", "VAKBN",
    "VESBE", "VESTL", "YATAS", "YKBNK", "ZOREN"
  ]
};

// Döviz kurları listesi
const CURRENCY_LIST = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD"];

// Endeks listesi
const INDEX_LIST = [
  { code: "XU100", name: "BIST 100", value: 10850, change: 1.2 },
  { code: "XU030", name: "BIST 30", value: 11420, change: 0.8 },
  { code: "XBANK", name: "BIST Banka", value: 8750, change: -0.5 },
  { code: "XUSIN", name: "BIST Sınai", value: 6840, change: 1.8 },
  { code: "XUMAL", name: "BIST Mali", value: 4950, change: -1.1 }
];

// Kripto para listesi
const CRYPTO_LIST = [
  { id: "bitcoin", name: "Bitcoin (BTC)", price: 95000, change: 2.1 },
  { id: "ethereum", name: "Ethereum (ETH)", price: 3400, change: -0.8 },
  { id: "binancecoin", name: "BNB", price: 720, change: 1.5 },
  { id: "ripple", name: "XRP", price: 2.4, change: -2.3 },
  { id: "cardano", name: "Cardano (ADA)", price: 1.05, change: 0.7 }
];

// Emtia listesi (Commodities)
const COMMODITY_LIST = [
  { code: "GOLD", name: "Altın", value: 2650, unit: "$/oz", change: 0.8 },
  { code: "SILVER", name: "Gümüş", value: 31.45, unit: "$/oz", change: -0.3 },
  { code: "CRUDE", name: "Ham Petrol (WTI)", value: 78.50, unit: "$/varil", change: 1.2 },
  { code: "BRENT", name: "Brent Petrol", value: 82.30, unit: "$/varil", change: 0.9 },
  { code: "COPPER", name: "Bakır", value: 4.125, unit: "$/lb", change: -0.7 },
  { code: "WHEAT", name: "Buğday", value: 650, unit: "¢/bushel", change: 2.1 },
  { code: "NATGAS", name: "Doğal Gaz", value: 3.85, unit: "$/mmBtu", change: -1.5 },
  { code: "COFFEE", name: "Kahve", value: 245, unit: "¢/lb", change: 1.8 }
];

// Zaman aralıkları (milisaniye)
const INTERVALS = {
  NEWS_SLIDE: 10000,      // 10 saniye
  CURRENCY_UPDATE: 600000, // 10 dakika
  INDEX_UPDATE: 1800000,   // 30 dakika
  CRYPTO_UPDATE: 300000,   // 5 dakika
  COMMODITY_UPDATE: 1800000 // 30 dakika
};