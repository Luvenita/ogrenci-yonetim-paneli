## 🚀 Kurulum (Nasıl Çalıştırılır?)

Bu projeyi kendi bilgisayarınızda çalıştırmak için Firebase ayarlarını yapmanız gerekir.

1. Projeyi bilgisayarınıza indirin:
   `git clone https://github.com/kullaniciadin/proje-adin.git`

2. Gerekli paketleri yükleyin:
   `npm install`

3. Firebase Ayarları:
   - [Firebase Konsolu](https://console.firebase.google.com/)'na gidip yeni bir proje oluşturun.
   - Web App oluşturup config bilgilerini kopyalayın.
   - `lib/firebase.js` dosyasını açın.
   - `const firebaseConfig = { ... }` kısmındaki yer tutucuları kendi bilgilerinizle değiştirin.

4. Projeyi başlatın:
   `npm run dev`