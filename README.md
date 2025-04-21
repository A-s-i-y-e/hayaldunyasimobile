# HAYAL DÜNYAM: YAPAY ZEKA DESTEKLİ OKUL ÖNCESİ HİKAYE OLUŞTURMA PLATFORMU

## Proje Hakkında

"Hayal Dünyam" projesi okul öncesi dönem çocuklarının (3-7 yaş) yaratıcılıklarını ve hayal güçlerini geliştirmeyi amaçlayan, yapay zeka destekli interaktif bir hikaye oluşturma platformudur. Proje günümüz çocuklarının dijital dünyada pasif tüketici olmak yerine, aktif içerik üretici olmalarını desteklemek amacıyla ortaya çıkmıştır.

### Öne Çıkan Özellikler 🌟

- **Yapay Zeka Destekli Çizim Analizi**: Çocukların çizimlerini otomatik olarak analiz ederek karakterlere dönüştürme
- **Sesli Hikaye Oluşturma**: Çocukların kendi seslerini kaydederek hikayelerini seslendirebilme
- **Ebeveyn Kontrol Paneli**: Çocukların gelişimini takip edebilme ve içerik kontrolü
- **Güvenli Kullanım**: Çocuklar için özel tasarlanmış güvenli ve reklamsız ortam
- **Eğitici İçerik**: Yaş gruplarına özel eğitici ve eğlenceli aktiviteler
- **Çevrimdışı Çalışabilme**: İnternet bağlantısı olmadan da kullanılabilme özelliği

### Hedef Kitle 👥

#### Çocuklar (3-7 yaş)

- Yaratıcılığını geliştirmek isteyen
- Hikaye anlatmayı seven
- Resim çizmeyi seven
- Teknoloji ile tanışma aşamasında olan

#### Ebeveynler

- Çocuklarının yaratıcılığını desteklemek isteyen
- Güvenli dijital içerik arayan
- Çocuklarının gelişimini takip etmek isteyen
- Teknoloji kullanımını kontrol etmek isteyen

#### Eğitimciler

- Okul öncesi eğitimde teknoloji kullanmak isteyen
- Öğrencilerin yaratıcılığını geliştirmek isteyen
- İnteraktif öğrenme araçları arayan

### Problem Tanımı

- Çocukların yaratıcılıklarını dijital ortamda ifade edebilecekleri platformların sınırlı olması
- Mevcut uygulamaların çoğunun hazır şablonlar sunması ve çocukların özgün üretimlerini kısıtlaması
- Ebeveynlerin çocuklarının gelişimini takip edebilecekleri interaktif platformların azlığı

### Projenin Amacı

- Çocukların kendi çizdikleri karakterlerle hikayeler oluşturabilmesi
- Yapay zeka desteğiyle çizimlerin analiz edilip hikayeye dönüştürülmesi
- Çocukların kendi seslerini kaydederek hikayelerini seslendirebilmesi
- Ebeveynlerin çocuklarının gelişimini takip edebilmesi

## Haftalık İlerleme

### 1. Hafta ✅

- Proje gereksinimleri analizi yapıldı
- Temel dosya ve klasör yapısı oluşturuldu
- Gerekli teknolojiler belirlendi

### 2. Hafta ✅

- Expo ve React Native kurulumu tamamlandı
- Temel ekran tasarımları oluşturuldu
- Explore sayfası ve kategoriler eklendi
- Çizim sayfası için temel yapı hazırlandı

### 3. Hafta ✅

- Firebase veritabanı ve depolama sistemi kuruldu
- Temel sayfalar ve navigasyon yapısı oluşturuldu
- Giriş ve kayıt ekranları tasarlandı
- Firebase Authentication entegrasyonu başlatıldı

### 4. Hafta ✅

- Firebase Authentication entegrasyonu tamamlandı
- Login ve Register ekranları tamamlandı
- AuthContext ile kullanıcı durumu yönetimi eklendi
- Navigasyon yapısı düzenlendi

### 5. Hafta ✅

- Temel çizim özellikleri eklendi
- Çizim arayüzü oluşturuldu
- Fırça stilleri (kalem, fırça, marker, sprey) eklendi
- Temel şekiller (çizgi, dikdörtgen, daire) eklendi
- Renk paleti ve kalınlık seçenekleri eklendi

### 6. Hafta ✅

- Gelişmiş çizim özellikleri eklendi:
  - Ek şekiller (üçgen, yıldız, kalp, beşgen)
  - Silgi özelliği
  - Geri alma özelliği
  - Temizleme özelliği
  - Gelişmiş renk paleti (24 renk)
  - Dikey kalınlık seçenekleri
  - Kullanıcı dostu arayüz düzenlemeleri

### 7. Hafta ✅

- Temel hikaye oluşturma özellikleri eklendi:
  - Hikaye oluşturma ekranı
  - Çizim seçimi ve entegrasyonu
  - Metin girişi ve düzenleme
  - Kategori seçimi
  - Hikaye kaydetme ve yükleme
  - Hikaye listeleme ve görüntüleme
  - Arama ve filtreleme
  - Hikaye düzenleme ve silme

### Yapılacaklar 🚀

- Hikaye oluşturma gelişmiş özellikleri
  - Hikaye paylaşım özellikleri
  - Gelişmiş önizleme
  - Daha detaylı hata yönetimi
  - Ek düzenleme araçları
  - Gelişmiş filtreleme seçenekleri
- Ses kayıt sistemi
- Yapay zeka entegrasyonu
- Ebeveyn kontrol paneli
- Test ve optimizasyonlar

## Teknolojiler

### Frontend Teknolojileri

- React Native
- Expo
- React Navigation
- Expo Linear Gradient
- TypeScript

### Backend Teknolojileri

- Firebase
  - Authentication
  - Realtime Database
  - Storage
  - Cloud Functions
  - Hosting
  - Performance Monitoring
  - Analytics
  - Cloud Messaging

### Yapay Zeka ve Veri İşleme

- TensorFlow.js
- Web Speech API

const menuItems = [
{
title: "Çizim Yap",
icon: "pencil",
color: "#FF6B6B",
screen: "Draw",
description: "Hayallerini çizime dök",
image: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
},
// ... diğer öğeler için de benzer şekilde
];

menuItem: {
width: (width - 40) / 2,
aspectRatio: 1,
margin: 5,
borderRadius: 20,
padding: 15,
justifyContent: "center",
alignItems: "center",
elevation: 5,
shadowColor: "#000",
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.25,
shadowRadius: 3.84,
backgroundColor: "rgba(255,255,255,0.9)",
},

<View style={styles.menuItemContent}>
  <Image source={{ uri: item.image }} style={styles.menuImage} />
  <Text style={styles.menuText}>{item.title}</Text>
  <Text style={styles.menuDescription}>{item.description}</Text>
</View>

menuImage: {
width: 80,
height: 80,
marginBottom: 10,
},

menuText: {
color: "#333",
fontSize: 16,
fontWeight: "bold",
textAlign: "center",
marginBottom: 5,
},
menuDescription: {
color: "#666",
fontSize: 12,
textAlign: "center",
},

featuredCard: {
width: width \* 0.7,
marginRight: 15,
backgroundColor: "rgba(255,255,255,0.9)",
borderRadius: 20,
padding: 15,
elevation: 5,
shadowColor: "#000",
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.25,
shadowRadius: 3.84,
},

featuredTitle: {
fontSize: 20,
fontWeight: "bold",
color: "#333",
marginBottom: 5,
},
featuredDescription: {
fontSize: 14,
color: "#666",
},
