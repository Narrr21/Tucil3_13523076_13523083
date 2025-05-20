# Tucil3_13523076_13523083
> IF2211 - Strategi Algoritma

## Description

Program ini adalah aplikasi solver untuk permainan puzzle "Rush Hour", menggunakan algoritma pathfinding untuk mencari solusi, dengan heuristik tertentu untuk meningkatkan efisiensi pencarian.

## Features

- Algoritma Pathfinding: 
    - Greedy Best First Search (GBFS)
    - Uniform Cost Search (UCS)
    - A*
    - Simulated Annealing
- Interface berbasis web
- Kemudahan penggunaan antarmuka dan User Experience yang intuitif dengan drag & drop.
- Visualisasi solusi secara **animasi** langkah demi langkah
- Menampilkan waktu eksekusi dan jumlah langkah solusi
- Mendukung input papan custom dan file konfigurasi

## Requirements

- Node.js v18.18.0 atau lebih tinggi
- Java v21 atau lebih tinggi

## Usage

1. Install dependencies dan jalankan kedua server:

    Frontend:
    ```bash
    cd ./src/frontend
    npm install
    npm run dev
    ```

    Backend:
    ```bash
    cd ./src/backend
    ./mvnw spring-boot:run
    ```
2. Kunjungi http://localhost:3000 pada web browser.
3. Atur papan permainan atau unggah file .txt yang berisi konfigurasi papan.
4. Pilih algoritma penyelesaian.
5. Klik tombol Solve dan tunggu hingga solusi ditemukan.

## Authors

- 13523076 - Nadhif Al Rozin
- 13523083 - David Bakti Lodianto
