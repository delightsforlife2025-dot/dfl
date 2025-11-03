# Dashboard Yönetim Paneli

Güvenli admin paneli sistemi kuruldu.

## 🔐 Giriş Bilgileri

**E-posta:** `admin@restaurant.com`  
**Şifre:** `admin123`

## 📍 URL'ler

- **Login:** `/dashboard/login`
- **Dashboard Ana Sayfa:** `/dashboard`

## 🛡️ Güvenlik Özellikleri

### Middleware Koruması
- `/dashboard` altındaki tüm sayfalar middleware ile korunuyor
- Token olmadan giriş yapılamaz
- Token varsa login sayfasına gidildiğinde otomatik dashboard'a yönlendirilir

### Cookie-based Authentication
- HttpOnly cookie kullanılıyor (XSS saldırılarına karşı koruma)
- 1 gün geçerlilik süresi
- Secure flag (production'da HTTPS zorunlu)
- SameSite strict (CSRF saldırılarına karşı koruma)

### API Endpoints
- `POST /api/auth/login` - Giriş yapma
- `POST /api/auth/logout` - Çıkış yapma

## 📁 Dosya Yapısı

```
app/
├── dashboard/
│   ├── page.tsx              # Dashboard ana sayfa
│   ├── login/
│   │   └── page.tsx          # Login sayfası
│   ├── menu/                 # (ileride eklenecek)
│   ├── categories/           # (ileride eklenecek)
│   ├── gallery/              # (ileride eklenecek)
│   ├── messages/             # (ileride eklenecek)
│   └── settings/             # (ileride eklenecek)
├── api/
│   └── auth/
│       ├── login/
│       │   └── route.ts      # Login API
│       └── logout/
│           └── route.ts      # Logout API
middleware.ts                 # Route protection
```

## 🎨 Dashboard Özellikleri

### Ana Sayfa
- ✅ Responsive sidebar navigasyon
- ✅ İstatistik kartları (menu öğeleri, kategoriler, galeri, mesajlar)
- ✅ Hızlı eylem kartları
- ✅ Son mesajlar tablosu
- ✅ Çıkış yapma fonksiyonu

### Login Sayfası
- ✅ Modern ve minimal tasarım
- ✅ Form validasyonu
- ✅ Error mesajları
- ✅ Loading state
- ✅ Demo credentials gösterimi

### Navigasyon Menüsü
1. **Genel Bakış** - Dashboard ana sayfa
2. **Menü Yönetimi** - Yemek ekleme/düzenleme (TODO)
3. **Kategoriler** - Kategori yönetimi (TODO)
4. **Galeri** - Fotoğraf yükleme (TODO)
5. **Mesajlar** - İletişim formu mesajları (TODO)
6. **Site Ayarları** - Site bilgileri düzenleme (TODO)

## 🚀 Test Etme

1. Development server'ı başlatın:
```bash
npm run dev
```

2. Login sayfasına gidin:
```
http://localhost:3000/dashboard/login
```

3. Demo credentials ile giriş yapın:
- E-posta: `admin@restaurant.com`
- Şifre: `admin123`

4. Dashboard sayfasında olduğunuzu doğrulayın

5. Logout yapın ve tekrar giriş yapmadan `/dashboard` adresine gitmeyi deneyin - login sayfasına yönlendirileceksiniz

## 🔒 Production İçin Öneriler

### 1. Güvenli Şifre Sistemi
Şu anki sistem demo amaçlıdır. Production'da:
- Şifreleri hash'leyin (bcrypt kullanın)
- Supabase Auth kullanın
- JWT token sistemi ekleyin

```typescript
// Örnek: bcrypt ile şifre kontrolü
import bcrypt from 'bcrypt';

const isValidPassword = await bcrypt.compare(password, hashedPassword);
```

### 2. Environment Variables
`.env.local` dosyasına ekleyin:
```env
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=your_hashed_password
JWT_SECRET=your_secret_key
```

### 3. Supabase Auth Integration
```typescript
// Supabase auth kullanımı
import { supabase } from '@/lib/supabaseClient';

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

### 4. Rate Limiting
Login endpoint'ine rate limiting ekleyin:
- Aynı IP'den çok fazla deneme yapılmasını engelleyin
- CAPTCHA ekleyin

### 5. Session Management
- Redis ile session yönetimi
- Token refresh mekanizması
- Multi-device support

## 📊 Veritabanı Entegrasyonu (Gelecek)

Dashboard sayfalarında Supabase'den veri çekilecek:

```typescript
// Örnek: Mesajları çekme
const { data: messages } = await supabase
  .from('contact_messages')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10);
```

## 🎯 Sonraki Adımlar

1. **Mesajlar Sayfası** - İletişim formundan gelen mesajları görüntüleme
2. **Site Ayarları** - Contact info, opening hours düzenleme
3. **Menü Yönetimi** - Menu items CRUD operasyonları
4. **Kategoriler** - Kategori yönetimi
5. **Galeri** - Fotoğraf upload ve yönetimi
6. **Supabase Auth** - Gerçek authentication sistemi
7. **Image Upload** - Supabase Storage ile fotoğraf yükleme
8. **Rich Text Editor** - Sayfa içeriklerini düzenleme

## 🐛 Sorun Giderme

### Cookie çalışmıyor
- Browser'da cookies'in enabled olduğundan emin olun
- Incognito/Private mode kullanmayın
- `localhost` üzerinde test edin

### Middleware redirect loop
- Cookie doğru set ediliyor mu kontrol edin
- Browser console'da hataları kontrol edin

### Login başarılı ama dashboard'a gitmiyor
- `router.refresh()` çağrıldığından emin olun
- Browser cache'i temizleyin
