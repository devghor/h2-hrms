# H2-HRMS

**H2-HRMS** is an actively developed full-stack application built with **Laravel** and **Inertia.js**. It provides a solid foundation for creating scalable, modern web applications with a seamless single-page experience powered by server-driven frontend rendering.

⚠️ **Note:** This project is currently in **development**. Features are incomplete and may evolve over time.

## 🚀 Getting Started

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/devghor/h2-hrms.git
cd h2-hrms
```

2. **Install dependencies**

```bash
composer install
npm install
```

3. **Environment setup**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Database configuration**

Update your `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=h2_hrms
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. **Run migrations**

```bash
php artisan migrate
```

6. **Build assets**

```bash
npm run dev
# or for production
npm run build
```

7. **Start the development server**

```bash
php artisan serve
```

## 🛠️ Tech Stack

- **Backend:** Laravel (PHP Framework)
- **Frontend:** Inertia.js with React Shadcn
- **Database:** MySQL/PostgreSQL
- **Asset Bundling:** Vite
- **Styling:** Tailwind CSS (assumed)
