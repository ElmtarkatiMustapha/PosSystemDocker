# WebStock

A modern, web-based **Point-of-Sale (POS) and inventory/stock management system** built with **React** and **Laravel**. It supports multi-role authentication, product/stock tracking, sales, purchases, returns, delivery orders, expenses, dashboard statistics, PDF receipts, and thermal printer integration.

![License](https://img.shields.io/badge/license-Apache%202.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Laravel](https://img.shields.io/badge/Laravel-8.x-FF2D20?logo=laravel)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)
![Last Commit](https://img.shields.io/github/last-commit/ElmtarkatiMustapha/PosSystemDocker)

---

## ✨ Features

- **Multi-role authentication** (admin, manager, cashier, delivery) via Laravel Sanctum
- **Catalog management**: categories, products, suppliers, customers, sectors
- **Stock control**: purchases, sales, returns, stock adjustments
- **Orders & delivery**: order lifecycle and delivery order tracking
- **Cash register sessions** and expense tracking
- **Dashboard & statistics** with Chart.js visualizations
- **PDF receipts** and thermal printer support
- **Multi-language UI** (Arabic, English, French)
- **Docker Compose** setup for one-command local deployment

---

## 🏗️ Tech Stack

| Layer        | Technology                                  |
|--------------|---------------------------------------------|
| Frontend     | React 18, Vite 5, React Router 6, Bootstrap 5 |
| Backend      | Laravel 8, PHP 8, Laravel Sanctum           |
| Database     | MySQL 8                                     |
| DevOps       | Docker, Docker Compose, Nginx               |

---

## 📸 Screenshots

> Add your screenshots to `assets/screenshots/` and update the paths below.

```markdown
![Login](assets/screenshots/login.png)
![Dashboard](assets/screenshots/dashboard.png)
![POS](assets/screenshots/pos.png)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PHP** 8.0+ and [Composer](https://getcomposer.org/)
- **MySQL** 8 (or use Docker)
- (Optional) [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Clone the repository

```bash
git clone https://github.com/ElmtarkatiMustapha/PosSystemDocker.git
cd esdStockCustom
```

### 2. Backend setup

```bash
cd server-side
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

> The API will run at `http://localhost:8000`.

### 3. Frontend setup

```bash
cd client-side
npm install
```

Create a `.env` file in `client-side/`:

```env
VITE_API_URL=http://localhost:8000
```

Then start the dev server:

```bash
npm run dev
```

> The frontend will run at `http://localhost:5173` by default.

---

## 🐳 Docker Setup

The easiest way to run the full stack locally:

```bash
# Copy the Docker Compose and environment templates
cp docker-compose.yml.example docker-compose.yml
cp server-side/.env.docker.example server-side/.env.docker

# Set your real database password and APP_KEY in both files
# Then build and run
docker compose up -d --build
```

The application will be available at:

- **Frontend:** http://localhost
- **Backend API:** http://localhost/api/

---

## ⚙️ Environment Variables

### Backend (`server-side/.env`)

| Variable        | Description                              | Example                   |
|-----------------|------------------------------------------|---------------------------|
| `APP_NAME`      | Application name                         | `WebStock`                |
| `APP_KEY`       | Laravel encryption key                   | `base64:...`              |
| `APP_URL`       | Application URL                          | `http://localhost:8000`   |
| `DB_CONNECTION` | Database driver                          | `mysql`                   |
| `DB_HOST`       | Database host                            | `127.0.0.1` or `db`       |
| `DB_DATABASE`   | Database name                            | `meaningstocklara`        |
| `DB_USERNAME`   | Database user                            | `root`                    |
| `DB_PASSWORD`   | Database password                        | `your_password`           |

### Frontend (`client-side/.env`)

| Variable          | Description        | Default                   |
|-------------------|--------------------|---------------------------|
| `VITE_API_URL`    | Backend API URL    | `http://localhost:8000`   |

---

## 🛠️ Manual Production Build

```bash
# 1. Build the React app
cd client-side
npm run build

# 2. Copy the generated dist folder into the Laravel public/resources folders
cp -r dist/* ../server-side/public/
cp -r dist/* ../server-side/resources/dist/

# 3. Run the Laravel server
cd ../server-side
php artisan serve
```

---

## 🧪 Testing

```bash
# Backend tests
cd server-side
php artisan test

# Frontend lint
cd client-side
npm run lint
```

---

## 📁 Project Structure

```text
esdStockCustom/
├── client-side/   # React + Vite frontend
├── server-side/   # Laravel backend
├── assets/        # Screenshots & documentation assets
├── docker-compose.yml
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request for any bug fix or feature suggestion.

---

## 📝 License

This project is licensed under the [Apache License 2.0](LICENSE).

You may use, modify, and distribute this project for personal or commercial purposes, subject to the terms of the license.

---

## 👤 Author

- **Elmtarkati Mustapha**
- GitHub: [@ElmtarkatiMustapha](https://github.com/ElmtarkatiMustapha)
