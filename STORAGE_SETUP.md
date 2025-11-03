# Supabase Storage Kurulumu

## Menu Images Bucket Oluşturma

Ürün fotoğraflarını depolamak için Supabase Storage'da bir bucket oluşturmanız gerekiyor.

### Adımlar:

1. **Supabase Dashboard'a gidin**
   - https://app.supabase.com adresinden projenize giriş yapın

2. **Storage bölümüne gidin**
   - Sol menüden "Storage" seçeneğine tıklayın

3. **Yeni Bucket Oluşturun**
   - "Create a new bucket" butonuna tıklayın
   - Bucket adı: `menu-images`
   - Public bucket: ✅ **Evet** (Public olarak işaretleyin)
   - "Create bucket" butonuna tıklayın

4. **Bucket Politikalarını Ayarlayın**
   
   ⚠️ **ÖNEMLİ:** İki yöntemden birini kullanın:

   **YÖNTEM A: Supabase Dashboard'dan (ÖNERİLEN)**
   1. Storage → Policies sekmesine gidin
   2. "New Policy" butonuna tıklayın
   3. Her politika için aşağıdaki ayarları yapın:

   **Policy 1: Read (SELECT)**
   - Policy name: `Public read access for menu images`
   - Allowed operation: SELECT
   - Target roles: `public`
   - USING expression: `bucket_id = 'menu-images'`

   **Policy 2: Insert**
   - Policy name: `Authenticated users can upload menu images`
   - Allowed operation: INSERT
   - Target roles: `authenticated`
   - WITH CHECK expression: `bucket_id = 'menu-images' AND auth.role() = 'authenticated'`

   **Policy 3: Update**
   - Policy name: `Authenticated users can update menu images`
   - Allowed operation: UPDATE
   - Target roles: `authenticated`
   - USING expression: `bucket_id = 'menu-images' AND auth.role() = 'authenticated'`

   **Policy 4: Delete**
   - Policy name: `Authenticated users can delete menu images`
   - Allowed operation: DELETE
   - Target roles: `authenticated`
   - USING expression: `bucket_id = 'menu-images' AND auth.role() = 'authenticated'`

   ---

   **YÖNTEM B: SQL ile (Alternatif)**
   
   SQL Editor'de şu komutları çalıştırın:

```sql
-- 1. Public read access
CREATE POLICY IF NOT EXISTS "Public read access for menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- 2. Authenticated users can upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload menu images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-images' 
  AND auth.role() = 'authenticated'
);

-- 3. Authenticated users can update
CREATE POLICY IF NOT EXISTS "Authenticated users can update menu images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
);

-- 4. Authenticated users can delete
CREATE POLICY IF NOT EXISTS "Authenticated users can delete menu images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
);
```

   📄 **Daha fazla seçenek için:** `sql/storage_policies.sql` dosyasına bakın

### Bucket Ayarları:

- **File size limit**: 5MB (varsayılan)
- **Allowed MIME types**: 
  - image/jpeg
  - image/png
  - image/gif
  - image/webp

### Mevcut Veritabanını Güncelleme:

Eğer `menu_items` tablosu zaten mevcutsa, yeni `images` kolonunu eklemek için:

```sql
-- Add images column to existing menu_items table
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS images text[];
```

### Test Etme:

1. Dashboard'da bir ürün ekleyin veya düzenleyin
2. "Ürün Fotoğrafları" bölümünden fotoğraf yükleyin
3. Fotoğrafların yüklendiğini ve önizlendiğini kontrol edin
4. Ürünü kaydedin ve fotoğrafların veritabanında saklandığını doğrulayın

### Sorun Giderme:

**Yükleme Hatası:**
- Bucket'ın public olarak ayarlandığından emin olun
- Storage politikalarının doğru şekilde oluşturulduğunu kontrol edin
- Supabase Console'da Storage > Policies bölümünden politikaları görüntüleyin

**Fotoğraflar Görünmüyor:**
- Browser console'da hata mesajlarını kontrol edin
- Fotoğraf URL'lerinin doğru formatda olduğunu kontrol edin
- CORS ayarlarının düzgün olduğundan emin olun

**Dosya Boyutu Hatası:**
- Bucket ayarlarından dosya boyutu limitini kontrol edin
- Gerekirse limiti artırın (Storage > Settings)

### Önemli Notlar:

- Fotoğraflar otomatik olarak unique isimlerle kaydedilir (timestamp + random string)
- Silinen fotoğraflar Supabase Storage'dan da silinir
- Her ürüne maksimum 5 fotoğraf yüklenebilir (bu sayı `ImageUpload` component'inde değiştirilebilir)
- Fotoğraflar sıralanabilir (1, 2, 3, 4, 5 olarak numaralandırılır)
