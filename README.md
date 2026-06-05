# Pensiun Mudah

Learning Management System (LMS) untuk membantu pengguna mempersiapkan masa pensiun melalui pelatihan, konsultasi, dan berbagai materi pembelajaran.

---

## 🚀 Requirements

Pastikan perangkat Anda telah terpasang:

* PHP >= 8.2
* Composer
* Node.js >= 18
* NPM
* MySQL / MariaDB

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/xyzchoco/pensiun-mudah.git
cd pensiun-mudah
```

### 2. Install Dependencies

Install dependency backend Laravel:

```bash
composer install
```

Install dependency frontend:

```bash
npm install
```

### 3. Setup Environment

Salin file environment:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

### 4. Configure Database

Buka file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pensiun_mudah
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Run Database Migration

```bash
php artisan migrate
```

Jika tersedia seeder:

```bash
php artisan db:seed
```

---

## ▶️ Running the Project

Jalankan aplikasi menggunakan dua terminal.

### Terminal 1 - Laravel Server

```bash
php artisan serve
```

### Terminal 2 - Vite Development Server

```bash
npm run dev
```

---

## 🌐 Access Application

Setelah kedua service berjalan, buka:

```text
http://127.0.0.1:8000
```

---

## 🛠 Tech Stack

### Backend

* Laravel 13
* Inertia.js

### Frontend

* React.js
* Tailwind CSS
* Vite

### Database

* MySQL / MariaDB

---

## 📄 License

This project is developed for JTCC
