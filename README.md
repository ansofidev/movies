# 🎥 WebbyLab Movies Frontend

This is a single-page React application for managing a movie collection.
It was built as part of a WebbyLab test task.

---

## 📆 Tech Stack

* React + TypeScript
* Redux Toolkit
* Axios
* SCSS / CSS Modules
* Vite (for development/build tooling)
* API: [WebbyLab Movies Backend](https://hub.docker.com/r/webbylabhub/movies)

---

## ✅ Features

* ✔ Import movies from `.txt` file
* ✔ Display movie list sorted alphabetically by title
* ✔ Delete movie
* ✔ Search by title or actor
* ✔ View movie details
* ✔ API integration with JWT authentication

---

## 🚀 Quick Start (Locally)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/webbylab-movies.git
cd webbylab-movies
```

### 2. Install dependencies

```bash
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in the root directory and copy from `.env.example`:

```bash
cp .env.example .env
```

Configure the API URL if different from default:

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
```

Optionally, include a JWT token:

```dotenv
VITE_API_TOKEN=your_jwt_token_here
```

### 3. Run the app

```bash
npm run dev
```

Your app will be available at:
📍 Frontend: [http://localhost:5173/movies](http://localhost:5173/movies)
📍 Backend (API): [http://localhost:8000](http://localhost:8000)

---

## 🔐 Authentication

All API requests require a JWT token. Get one using:

```bash
curl -X POST http://localhost:8000/api/v1/sessions \
  -H 'Content-Type: application/json' \
  -d '{"email": "your@email.com", "password": "your-password"}'
```

Copy the token from the response and manually insert it into the frontend code if needed.
(Currently, token may be included directly in request configuration or stored internally.)

---

## 📂 Importing Movies

1. Go to the "Import Movies from .txt" section
2. Upload a text file in the following format:

```
Title: Movie Title
Release Year: 2000
Format: DVD
Stars: Actor One, Actor Two
```

✉ Example file: [sample\_movies.txt](https://gist.github.com/k0stik/3028d42973544dd61c3b4ad863378cad)

---

## 🔗 Links

* API Docker: [https://hub.docker.com/r/webbylabhub/movies](https://hub.docker.com/r/webbylabhub/movies)
* API Docs: [https://documenter.getpostman.com/view/356840/TzkyLeVK](https://documenter.getpostman.com/view/356840/TzkyLeVK)
* GitHub (Frontend): [https://github.com/yourusername/webbylab-movies](https://github.com/yourusername/webbylab-movies)

---

## 🔮 Testing

There are no automated tests yet. The component structure allows easy extension using React Testing Library.

---

## 📧 Contact

This project was created as part of a technical task for WebbyLab.

> Contact: [ansophidev@gmail.com](mailto:ansophidev@gmail.com)
