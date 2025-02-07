# 🤖 Cebot

Cebot adalah chatbot sederhana yang dibangun menggunakan **Next.js** untuk frontend dan **Supabase** sebagai backend.

## ✨ Fitur

- 🚀 **Next.js** untuk tampilan antarmuka yang cepat dan modern
- 🗄️ **Supabase** sebagai backend yang andal
- 💬 **Fungsi chatbot dasar** untuk berinteraksi dengan pengguna

## 📌 Instalasi

1. **Clone repository:**
   ```sh
   git clone https://github.com/rizkirmdhn1215/cebot.git
   cd cebot
   ```

2. **Instal dependensi:**
   ```sh
   npm install
   ```

3. **Konfigurasi Supabase:**
   - Buat proyek di [Supabase](https://supabase.io).
   - Dapatkan **Supabase URL** dan **API Key**.
   - Buat file `.env.local` di direktori root proyek dan tambahkan variabel berikut:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

4. **Jalankan server pengembangan:**
   ```sh
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.
   Untuk Realtime Web dapat diakses di (cebot-sigma.vercel.app)

## 🎯 Penggunaan

- Gunakan chatbot melalui antarmuka web.
- Sesuaikan respons dan perilaku chatbot melalui backend Supabase.

## 🤝 Kontribusi

Kontribusi sangat diterima! Jangan ragu untuk membuka **issue** atau mengajukan **pull request**.

## 📜 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

