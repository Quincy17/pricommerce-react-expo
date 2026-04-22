<div align="center">

# PriCommerce

**Aplikasi e-commerce cross-platform modern dengan pembayaran QRIS**

[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State%20Management-orange?style=flat-square)](https://zustand-demo.pmnd.rs/)

</div>

---

## Tentang Aplikasi

**PriCommerce** adalah aplikasi e-commerce mobile yang dibangun di atas **Expo** dan **React Native**, mendukung platform **iOS** dan **Android** secara bersamaan. Aplikasi ini dilengkapi fitur browse produk, keranjang belanja, checkout, hingga pembayaran menggunakan **QRIS** (Quick Response Code Indonesian Standard).

---

## Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Home** | Hero banner otomatis, kategori produk, daftar produk unggulan & terbaru |
| **Katalog** | Grid semua produk dengan search, filter kategori, dan sorting |
| **Detail Produk** | Foto produk, rating, deskripsi, ulasan, pilih jumlah |
| **Keranjang** | Kelola item, ubah jumlah, gratis ongkir otomatis >= Rp500.000 |
| **Checkout** | Form alamat pengiriman, pilih ekspedisi (Reguler/Express/Same Day) |
| **Bayar QRIS** | QR Code dinamis, countdown 15 menit, kompatibel semua bank & e-wallet |
| **Order Success** | Animasi konfirmasi, nomor pesanan, navigasi ke riwayat |
| **Profil** | Statistik belanja, riwayat pesanan, menu pengaturan |

---

## Struktur Proyek

```
pricommerce/
├── app/
│   ├── _layout.tsx              # Root layout (Stack navigator + tema)
│   ├── checkout.tsx             # Form checkout & pilih ekspedisi
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigator (4 tab + cart badge)
│   │   ├── index.tsx            # Home Screen
│   │   ├── explore.tsx          # Katalog produk
│   │   ├── cart.tsx             # Keranjang belanja
│   │   └── profile.tsx          # Profil & riwayat pesanan
│   ├── product/
│   │   └── [id].tsx             # Detail produk (dynamic route)
│   └── payment/
│       ├── qris.tsx             # Halaman pembayaran QRIS
│       └── success.tsx          # Konfirmasi pesanan berhasil
│
├── components/
│   ├── ProductCard.tsx          # Card produk di grid
│   ├── CartItem.tsx             # Item di keranjang + qty adjuster
│   ├── QRISDisplay.tsx          # QR Code + timer + instruksi
│   ├── CategoryFilter.tsx       # Filter kategori horizontal scroll
│   ├── OrderSummary.tsx         # Ringkasan harga di checkout
│   └── HeroBanner.tsx           # Banner promo auto-slide
│
├── store/
│   ├── cartStore.ts             # Zustand: state keranjang
│   └── orderStore.ts            # Zustand: state & riwayat pesanan
│
├── data/
│   └── products.ts              # Mock data 20 produk + kategori
│
└── constants/
    └── theme.ts                 # Design tokens (warna, format harga)
```

---

## Tech Stack

- **[Expo SDK 54](https://expo.dev/)** — Framework React Native
- **[Expo Router v6](https://expo.github.io/router/)** — File-based navigation
- **[React Native 0.81](https://reactnative.dev/)** — Core framework
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety
- **[Zustand](https://zustand-demo.pmnd.rs/)** — State management (cart & order)
- **[react-native-qrcode-svg](https://github.com/awesomejerry/react-native-qrcode-svg)** — Generate QR Code QRIS
- **[expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** — Gradient UI
- **[react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)** — Animasi halus

---

## Cara Menjalankan

### Prerequisites

- Node.js 18+
- npm atau yarn
- [Expo Go](https://expo.dev/go) di HP (iOS/Android) **atau** emulator

### Instalasi

```bash
# Clone repositori
git clone <repo-url>
cd my-expo-app

# Install dependencies
npm install
```

### Menjalankan Aplikasi

```bash
# Jalankan dev server
npm start
# atau
npx expo start

# Untuk Android emulator
npm run android

# Untuk iOS simulator (macOS only)
npm run ios
```

Scan QR Code yang muncul di terminal menggunakan aplikasi **Expo Go** di HP kamu.

---

## Implementasi QRIS

Aplikasi ini menggunakan QRIS format **EMV QR Code** sesuai standar Bank Indonesia.

### Mode Demo (Saat Ini)

- QR Code di-generate secara **lokal** di device
- Pembayaran **otomatis terkonfirmasi dalam 5 detik** (simulasi)
- Countdown timer **15 menit** sebelum expired

### Untuk Produksi

Untuk penggunaan nyata, string QRIS harus berasal dari **Payment Gateway** resmi:

| Provider | Dokumentasi |
|----------|-------------|
| Midtrans | https://midtrans.com/id/api |
| Xendit | https://www.xendit.co/id/developers |
| DOKU | https://developers.doku.com |
| Faspay | https://www.faspay.co.id |

> **Catatan:** Merchant wajib terdaftar di Bank Indonesia / penyedia QRIS resmi untuk menggunakan QRIS di produksi.

---

## Alur Checkout

```
Home / Katalog
    -> Detail Produk -> Add to Cart
        -> Keranjang
            -> Checkout (isi alamat + pilih ekspedisi)
                -> Bayar dengan QRIS (scan QR Code)
                    -> Pembayaran Berhasil
                        -> Riwayat Pesanan (tab Profil)
```

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0F172A` (Deep Navy) |
| Surface | `#1E293B` |
| Accent | `#FF6B2B` (Electric Orange) |
| Text | `#F1F5F9` |
| Success | `#10B981` |
| Star/Rating | `#FBBF24` |

---

## Kategori Produk

- Elektronik
- Fashion
- Sneakers
- Aksesoris
- Kecantikan
- Olahraga

---

## Lisensi

MIT License © 2026 PriCommerce
