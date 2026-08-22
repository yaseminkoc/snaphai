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

## Yayına alma — Vercel (önerilen)
Site tamamen statiktir, **build adımı yoktur**. `vercel.json` hazır.

### Yol A — Vercel CLI (en hızlı)
```bash
npm i -g vercel
cd C:\Users\Yasemin\Desktop\snaphai
vercel            # ilk sefer: giriş + proje oluşturma (soruların hepsine Enter/varsayılan)
vercel --prod     # production'a al
```
Sorulursa: **Framework Preset: Other**, **Build Command: (boş)**, **Output Directory: ./** .

### Yol B — GitHub + Vercel paneli
1. Klasörü bir GitHub reposuna gönder.
2. vercel.com → **Add New → Project** → repoyu **Import** et.
3. Framework: **Other**, build ayarı yok → **Deploy**.

### Alan adı (snaphai.com)
Vercel projesi → **Settings → Domains → Add** → `snaphai.com`.
Vercel'in verdiği DNS kayıtlarını (A kaydı ya da nameserver) alan adı sağlayıcında gir.

> Not: `assets/` klasörü (logo.png, mascot.png, favicon.svg, logo.svg) mutlaka
> deploy'a dahil olmalı — hepsi bu klasörde, otomatik yüklenir.

## Diğer yayınlama seçenekleri
- **Netlify / Cloudflare Pages** → klasörü sürükle-bırak, otomatik yayınlanır.
- **GitHub Pages** → repoya at, Pages'i aç.
- **Klasik hosting (cPanel)** → dosyaları `public_html` içine kopyala.

## Görselleri ekle (logo + maskot)
Site, iki gerçek görseli **sen klasöre koyunca otomatik** kullanır. Koymazsan
site bozulmaz: logo yerine SVG amblem çizimi görünür, maskot ise gizlenir.

1. **Logo:** dosyanı `assets/logo.png` olarak kaydet. Menüdeki (nav) amblem
   anında senin logonla değişir. (Footer'da tema uyumlu SVG amblem kullanılır.)
2. **Maskot:** parlayan küre maskotunu `assets/mascot.png` olarak kaydet
   (arka planı şeffaf PNG önerilir). Hero bölümünde telefonun yanında ve alttaki
   "Loncana bugün katıl" CTA bandında süzülerek görünür.
3. **Sosyal paylaşım görseli (opsiyonel):** 1200×630 px bir `assets/og.png` ekle —
   link paylaşımlarında önizleme görseli olur (kafadaki `og:image` etiketi hazır).

## Özelleştirme ipuçları
- Renkler ve yazı tipleri: `styles.css` en üstteki `:root` değişkenleri.
- Fiyatlar: `index.html` içinde `data-monthly` / `data-yearly` değerleri.
- Demo formu şu an sadece arayüz; gerçek gönderim için `script.js` içindeki
  `demoForm` submit bloğuna kendi API / e-posta servisini bağla (ör. Formspree).
# snaphai
