# SnaphAI — Tanıtım Sitesi

Instagram'ın Dijital Loncası. Butikler için otonom yapay zeka çalışanı platformunun
tek sayfalık, **frontend-only** tanıtım sitesi.

## Dosyalar
```
index.html      → sayfanın tamamı (tek sayfa, tüm bölümler)
styles.css      → tasarım / stiller (lacivert + altın tema)
script.js       → menü, fiyat aylık/yıllık geçişi, animasyonlar, demo formu
assets/
  logo.svg      → SVG amblem (orijinal logonun yeniden çizimi)
  favicon.svg   → sekme ikonu
```

## Çalıştırma (yerel)
Hiçbir kurulum gerekmez. `index.html` dosyasına çift tıkla — ya da basit bir sunucu:
```bash
# Python
python -m http.server 8000
# sonra: http://localhost:8000
```

## Yayına alma (snaphai.com)
Tamamen statik olduğu için herhangi bir yere sürükle-bırak yüklenebilir:
- **Netlify / Vercel / Cloudflare Pages** → klasörü bağla, otomatik yayınlanır.
- **GitHub Pages** → repoya at, Pages'i aç.
- **Klasik hosting (cPanel)** → dosyaları `public_html` içine kopyala.
Sonra `snaphai.com` alan adını sağlayıcının panelinden bağla.

## Kendi logonu koymak
Sitede amblem SVG olarak yeniden çizildi ve her yerde net görünür.
Orijinal PNG/SVG logonu kullanmak istersen:
1. Dosyanı `assets/logo.png` olarak koy.
2. `index.html` içindeki nav ve footer'daki `<span class="brand__mark">…</span>`
   bloğunu `<img src="assets/logo.png" alt="SnaphAI" style="width:38px;height:38px">`
   ile değiştir.

## Özelleştirme ipuçları
- Renkler ve yazı tipleri: `styles.css` en üstteki `:root` değişkenleri.
- Fiyatlar: `index.html` içinde `data-monthly` / `data-yearly` değerleri.
- Demo formu şu an sadece arayüz; gerçek gönderim için `script.js` içindeki
  `demoForm` submit bloğuna kendi API / e-posta servisini bağla (ör. Formspree).
# snaphai
