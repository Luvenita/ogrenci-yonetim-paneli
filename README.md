# Öğrenci Yönetim Paneli

Bu proje, öğrencilerin akademik durumlarını, sınav takvimlerini ve notlarını takip etmek için geliştirilmiş modern bir web tabanlı yönetim panelidir. **Next.js** ve **Firebase** teknolojileri kullanılarak geliştirilmiştir.

## 🚀 Özellikler

* **Dashboard:** Genel istatistikler ve KPI kartları ile hızlı bakış.
<<<<<<< HEAD
=======
<img width="3795" height="1752" alt="dashboard" src="https://github.com/user-attachments/assets/632fc24d-3229-44c9-ab0c-c688667b8988" />

Bu panel üzerinden uygulama yönetimi kolayca yapılabilir ve kullanıcıya büyük kolaylık sağlar.

>>>>>>> 13b0c830a62d1619d8ce6290ca922cf012a36ce5
* **Öğrenci Yönetimi:** Öğrenci listesi görüntüleme, ekleme ve detaylı bilgi panelleri.
<img width="3815" height="585" alt="student" src="https://github.com/user-attachments/assets/498f936e-9dc6-4429-b3ad-e2a7ad841013" />

Bu panelde kullanıcı öğrenci listesini görüntüler ve öğrenciler hakkında not, devamsızlık, öğrenciye özel bilgi notu ekleme gibi işlemleri
kolayca yönetebilir.

* **Not Takibi:** Sınav notlarının girişi ve grafiksel başarı analizleri.
<img width="3805" height="1755" alt="not" src="https://github.com/user-attachments/assets/8ecdd481-0962-4089-ab60-67fb9dd545e5" />

Bu panelde kullanıcı öğrencinin sınav notlarını görüntüleyebilir sınıf başarısını ve kalma geçme durumlarını değerlendirebilir.

* **Sınav Takvimi:** Yaklaşan sınavların ve etkinliklerin takibi.
<img width="1277" height="1595" alt="subject" src="https://github.com/user-attachments/assets/7ec2e914-9f91-487e-bb67-605a47de7d4d" />

Kullanıcı sınav zamanlarını unutabilir insanlık hali uygulamaya girdiği zaman eğer sınav tarihini kaydettiyse burdan görüp hatırlayabilir
veya kontrol etmek isterse bu kısma bakabilir.

* **Güvenli Altyapı:** Firebase Authentication ve Firestore veritabanı entegrasyonu.

## 🛠️ Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınıza kurmak için aşağıdaki adımları sırasıyla uygulayın.

### 1. Repoyu Klonlayın
Terminali açın ve projeyi indirin:

```bash
git clone [https://github.com/Luvenita/ogrenci-yonetim-paneli.git](https://github.com/Luvenita/ogrenci-yonetim-paneli.git)
cd ogrenci-yonetim-paneli
2. Bağımlılıkları Yükleyin
Gerekli paketleri indirmek için:

Bash

npm install
# veya
yarn install
3. ⚙️ Firebase Ayarlarını Yapılandırma (Önemli Adım)
Güvenlik nedeniyle projenin gerçek API anahtarları (API Keys) bu repoda bulunmamaktadır. Projeyi çalıştırabilmek için kendi Firebase bilgilerinizi girmelisiniz:

Proje klasöründeki lib klasörüne gidin.

Burada firebase.example.js adında bir dosya göreceksiniz.

Bu dosyanın adını firebase.js olarak değiştirin (veya kopyasını oluşturup adını değiştirin).

Oluşturduğunuz firebase.js dosyasını açın ve içerisindeki API_KEY, PROJECT_ID gibi alanları kendi Firebase konsolunuzdan aldığınız bilgilerle doldurun.

Not: firebase.js dosyası .gitignore listesinde olduğu için, girdiğiniz şifreler GitHub'a yüklenmez, güvende kalır.

4. Uygulamayı Başlatın
Her şey hazırsa geliştirme sunucusunu başlatın:

Bash

npm run dev
Tarayıcınızda http://localhost:3000 adresine giderek uygulamayı görüntüleyebilirsiniz.

Geliştirici: Luvenita
