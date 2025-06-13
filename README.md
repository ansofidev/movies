🎥 WebbyLab Movies Frontend

This is a single-page React application for managing a movie collection.It was built as part of a WebbyLab test task.

📆 Tech Stack

React + TypeScript

Redux Toolkit

Axios

SCSS / CSS Modules

Vite (for development/build tooling)

API: WebbyLab Movies Backend

✅ Features

✔ Import movies from .txt file

✔ Display movie list sorted alphabetically by title

✔ Delete movie

✔ Search by title or actor

✔ View movie details

✔ API integration with JWT authentication

🚀 Quick Start (Locally)

Clone the repository

git clone https://github.com/ansofidev/movies.git
cd webbylab-movies

Install dependencies

npm install

Run the app

npm run dev

Your app will be available at:📍 Frontend: http://localhost:5173/movies📍 Backend (API): http://localhost:8000

The API base URL is hardcoded as http://localhost:8000/api/v1 inside the app.
No .env file or runtime token configuration is currently required for the frontend.

🔐 Authentication

All API requests require a JWT token. Get one using:

curl -X POST http://localhost:8000/api/v1/sessions \
  -H 'Content-Type: application/json' \
  -d '{"email": "your@email.com", "password": "your-password"}'

Copy the token from the response and manually insert it into the frontend code if needed.
(Currently, token may be included directly in request configuration or stored internally.)

📂 Importing Movies

Go to the "Import Movies from .txt" section

Upload a text file in the following format:

Title: Movie Title
Release Year: 2000
Format: DVD
Stars: Actor One, Actor Two

✉ Example file: sample_movies.txt

🔗 Links

API Docker: https://hub.docker.com/r/webbylabhub/movies

API Docs: https://documenter.getpostman.com/view/356840/TzkyLeVK

GitHub (Frontend): https://ansofidev.github.io/movies/

🔮 Testing

There are no automated tests yet. The component structure allows easy extension using React Testing Library.

📧 Contact

This project was created as a part of a WebbyLab test task.Contact: [ansophidev@gmail.com]

