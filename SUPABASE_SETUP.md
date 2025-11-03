# Supabase Kurulum Rehberi

Bu proje Supabase kullanarak veritabanı yönetimi yapmaktadır. Aşağıdaki adımları takip ederek projeyi çalışır hale getirebilirsiniz.

## 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) sitesine gidin ve hesap oluşturun
2. "New Project" butonuna tıklayın
3. Proje detaylarını doldurun:
   - Proje adı (örn: "restaurant-dfl")
   - Database şifresi (güçlü bir şifre seçin ve kaydedin)
   - Region (size en yakın bölgeyi seçin)
4. "Create new project" butonuna tıklayın ve projenizin hazır olmasını bekleyin

## 2. Veritabanı Schema'sını Yükleme

1. Supabase Dashboard'unuzda sol menüden **SQL Editor**'ü açın
2. "New query" butonuna tıklayın
3. `sql/init_schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. "Run" butonuna tıklayarak SQL sorgusunu çalıştırın

Bu işlem aşağıdaki tabloları oluşturacaktır:
- `pages` - Sayfa içerikleri (Ana sayfa, Hakkımızda vb.)
- `nav_items` - Navigasyon menü öğeleri
- `social_links` - Sosyal medya linkleri
- `site_settings` - Site ayarları (adres, telefon, çalışma saatleri)
- `contact_messages` - İletişim formu mesajları

## 3. Environment Variables Ayarlama

1. Supabase Dashboard'da **Settings** > **API** bölümüne gidin
2. Şu değerleri bulun:
   - `Project URL`
   - `anon public` key

3. Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
cp .env.local.example .env.local
```

4. `.env.local` dosyasını açıp değerleri doldurun:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Row Level Security (RLS) Ayarları

Supabase tablolarınız için güvenlik politikaları ayarlamanız önerilir:

### Public Read Access (Herkes okuyabilir)

`pages`, `nav_items`, `social_links`, `site_settings` tabloları için:

```sql
-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public pages are viewable by everyone"
  ON pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public nav items are viewable by everyone"
  ON nav_items FOR SELECT
  USING (visible = true);

CREATE POLICY "Public social links are viewable by everyone"
  ON social_links FOR SELECT
  USING (true);

CREATE POLICY "Public site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);
```

### Contact Messages (Sadece yazmaya açık)

```sql
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert contact messages
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);
```

## 5. Projeyi Çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# Development server'ı başlatın
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açın.

## 6. İçerik Yönetimi

### Supabase Dashboard Üzerinden

1. **Table Editor**'e gidin
2. İlgili tabloyu seçin (`pages`, `nav_items`, vb.)
3. "Insert row" veya mevcut satırları düzenleyin

### Sayfa İçeriklerini Güncelleme

`pages` tablosunda `content` alanı JSONB formatındadır. Örnek yapılar:

#### Ana Sayfa (slug: 'home')
```json
{
  "hero": {
    "title": "Authentic Flavors, Modern Twist",
    "subtitle": "Experience the perfect blend...",
    "backgroundImage": "https://..."
  },
  "featured_dishes": [
    {
      "title": "Grilled Salmon",
      "description": "Perfect salmon...",
      "image": "https://..."
    }
  ],
  "philosophy": {
    "text": "We believe in quality..."
  }
}
```

## 7. Site Ayarları

`site_settings` tablosunda key-value çiftleri vardır:

```sql
-- İletişim bilgileri
INSERT INTO site_settings (key, value) VALUES
('contact_info', '{"address": "123 Main St", "phone": "+90 212 123 45 67", "email": "info@restaurant.com"}');

-- Çalışma saatleri
INSERT INTO site_settings (key, value) VALUES
('opening_hours', '{"mon_fri": "10:00-22:00", "sat": "09:00-23:00", "sun": "09:00-21:00"}');
```

## Sorun Giderme

### "Missing NEXT_PUBLIC_SUPABASE_URL" hatası
- `.env.local` dosyasının doğru konumda olduğundan emin olun
- Dosya adının tam olarak `.env.local` olduğunu kontrol edin
- Development server'ı yeniden başlatın

### Veritabanı bağlantı hatası
- Supabase proje URL'inizin doğru olduğunu kontrol edin
- Anon key'in doğru kopyalandığından emin olun
- Supabase projenizin aktif olduğunu kontrol edin

### RLS Policy hataları
- Tablolarınız için doğru politikaların ayarlandığından emin olun
- Dashboard > Authentication > Policies bölümünden kontrol edin

## Önemli Notlar

- Menü sayfası henüz Supabase'e bağlanmadı (gelecekte eklenecek)
- İletişim formundan gelen mesajlar `contact_messages` tablosuna kaydediliyor
- Sayfa içerikleri 60 saniyede bir otomatik olarak yenileniyor (revalidate)
- Production ortamına geçmeden önce güvenlik politikalarını gözden geçirin
