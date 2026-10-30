# WebPOS

Aplikasi Point of Sale (POS) berbasis web untuk mencatat transaksi, mengelola produk, kategori, dan pelanggan.

## 🔗 Demo

- **Live App**: https://web-pos-omega-five.vercel.app

- **Demo Account**:

  - Email: demo@webpos.com

  - Password: demo12345

## Tech Stack

**Backend**: Laravel 13, MySQL, Sanctum (auth)

**Frontend**: Vue.js, TypeScript

**Storage**: Supabase Storage (untuk gambar produk)

**Deployment**: Railway (backend), Vercel (frontend)

## Fitur

- Autentikasi berbasis token (Sanctum)

- Manajemen kategori & produk (dengan upload gambar)

- Manajemen pelanggan

- Pencatatan transaksi

## 📸 Screenshot

<img width="944" height="505" alt="image" src="https://github.com/user-attachments/assets/a1c0822d-b704-432b-b07e-e3439d351581" />


## Arsitektur

Backend dan frontend di-deploy terpisah sebagai REST API dan SPA, menghubungkan keduanya lewat environment variable untuk base URL API.
