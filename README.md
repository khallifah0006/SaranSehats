# Tutorial Menjalankan Website Saran Sehat

Berikut adalah langkah-langkah untuk menjalankan website **Saran Sehat** secara lokal:

## 1. Persiapan Awal

- Pastikan Anda sudah mengunduh file proyek **Saran Sehat**.
- Ekstrak file ZIP yang telah diunduh.
- Setelah ekstraksi, pastikan struktur folder tidak memiliki duplikasi (hindari folder di dalam folder seperti `SaranSehat/SaranSehat`).
- Navigasikan ke direktori utama proyek.

## 2. Menjalankan Backend (Machine Learning / Python)

1. Buka terminal dan navigasikan ke folder **backend** proyek:
  ```
   cd ML
  ```
2. Jalankan perintah berikut untuk menginstal dependensi Python:
```
pip install -r requirements.txt
```

3. Setelah semua dependensi terinstal, jalankan backend dengan perintah:
```
python main.py
```

## 3. Menjalankan Frontend (React / Node.js)
Buka terminal baru dan pastikan Anda berada di direktori utama proyek (di mana terdapat file package.json).

1. Jalankan perintah berikut untuk menginstal dependensi frontend:
```
npm install
```
2. Setelah proses instalasi selesai, bangun aplikasi dengan:
```
npm run build
```
3. Kemudian jalankan aplikasi dengan perintah:
```
npm run start
```

Website Saran Sehat sekarang seharusnya sudah berjalan dan dapat diakses melalui browser. Pastikan backend dan frontend berjalan di terminal yang terpisah.