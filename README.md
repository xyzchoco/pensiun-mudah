# 🚀 LMS Learning Management System

Sistem Learning Management System (LMS) modern yang dibangun untuk mendukung proses pembelajaran digital secara terstruktur, interaktif, dan efisien. Aplikasi ini menyediakan fitur manajemen kursus, pelacakan progres belajar otomatis, kuis, serta panel administrasi yang lengkap untuk mengelola seluruh konten pembelajaran.

---

## 🛠 Tech Stack

### Backend

* Laravel 12
* PHP 8.2+
* Laravel Sanctum
* Laravel Queue
* Filament Admin Panel v5

### Frontend

* React.js
* Inertia.js
* Vite
* Tailwind CSS

### Database

* PostgreSQL

### Payment Gateway

* Midtrans Sandbox

### Deployment

* Azure Cloud
* Biznet Gio VPS
* Nginx
* Ubuntu Server

---

## ✨ Features

### 📚 Course Management

* Manajemen kursus, modul, dan materi pembelajaran.
* Struktur pembelajaran berbasis modul.
* Pengurutan materi yang fleksibel.

### 📈 Learning Progress Tracking

* Pelacakan progres belajar otomatis.
* Perhitungan persentase penyelesaian kursus.
* Riwayat pembelajaran pengguna.

### 📝 Quiz & Assessment

* Pembuatan kuis untuk setiap modul.
* Penilaian otomatis.
* Evaluasi hasil belajar peserta.

### 🔒 Security & Access Control

* Validasi kepemilikan kursus.
* Proteksi akses materi pembelajaran.
* Authentication menggunakan Laravel Sanctum.

### 🎛 Admin Panel

* Dashboard administrasi menggunakan Filament v5.
* Manajemen pengguna.
* Manajemen kursus dan materi.
* Monitoring aktivitas pembelajaran.

### 💳 Payment Integration

* Integrasi Midtrans Sandbox.
* Simulasi pembayaran kursus.
* Verifikasi transaksi otomatis.

---

## 📂 Project Structure

```text
app/
├── Filament/
├── Http/
│   ├── Controllers/
│   └── Middleware/
├── Models/
├── Services/
└── Providers/

resources/
├── js/
│   ├── Pages/
│   ├── Components/
│   └── Layouts/
└── views/

routes/
├── web.php
└── api.php
```

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/xyzchoco/pensiun-mudah.git
cd pensiun-mudah
```

### 2. Install Dependencies

```bash
composer install
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Sesuaikan konfigurasi database PostgreSQL pada file `.env`.

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=pensiun_mudah
DB_USERNAME=postgres
DB_PASSWORD=123
```

### 4. Run Migration

```bash
php artisan migrate --seed
```

### 5. Build Frontend Assets

```bash
npm run build
```

### 6. Run Development Server

Backend:

```bash
php artisan serve
```

Frontend:

```bash
npm run dev
```

Aplikasi dapat diakses melalui:

```text
http://127.0.0.1:8000
```

---

## 🔌 API Example

### Mark Learning Material as Completed

**Endpoint**

```http
POST /api/materials/mark-done
```

**Request**

```json
{
    "material_id": 1
}
```

**Response**

```json
{
    "success": true,
    "message": "Progress berhasil diperbarui",
    "progress": 75
}
```

---

## 🌿 Git Workflow

### Branch Structure

```text
main        → Production
dev         → Development
backend     → Backend Development
frontend    → Frontend Development
```

### Development Flow

```bash
git checkout dev
git pull origin dev

git checkout -b feature/nama-fitur

git add .
git commit -m "feat: add new feature"

git push origin feature/nama-fitur
```

---

## 👨‍💻 Development Team

Developed as a modern Learning Management System platform using Laravel, React, PostgreSQL, and Filament Admin Panel.

---

## 📄 License

This project is licensed under the MIT License.
