# 🎵 UTUNE PODCAST APP | PORTFOLIO PIECE 💿

A full-featured React web application for browsing, viewing, and managing podcast shows. Users can search, explore by genre, view detailed season and episode info, manage favorite shows, view watch history, and enjoy in-app audio playback — all within a seamless experience using modern React features and routing.

---

## 🚀 Features

- 🔍 **Search for Shows**  
- 📺 **View Show Details**  
- 🎬 **Episode Playback with Global Player**  
- 📚 **Seasons & Episodes Navigation**  
- ❤️ **Favorite Shows Management**  
- 📖 **Listening History Tracking**  
- 🎭 **Browse by Genre**  
- 🔐 **User Authentication (Login & Register)**  
- 🧠 **Global Playback State via Context API**

---

## 🛠️ Project Setup

### 1. **Clone the repository**
```bash
git clone https://github.com/Uchechukwu-Udefi/UCHUDE24034_CPTO2409_Group-A_Uchechukwu-Udefi_DJS11 (main)
cd UCHUDE24034_CPTO2409_Group-A_Uchechukwu-Udefi_DJS11
```
### 2. **Install dependencies**
```bash
npm install
```
### 3. **Start the development server**
```bash
npm start
```
### 4. **Configured Vite/Webpack dev server port and open localhost in browser to see the app in action**
```bash
http://localhost:3000
```

## 🧭 Project Structure

uchechukwu-udefi-podcast-app/
│
├── assets/
│   ├── images/
│
├── public/
│   ├── _redirects
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── ConfirmModal.jsx
│   │   ├── Footer.jsx
│   │   ├── GlobalPlayer.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Search.jsx
│   │
│   ├── context/
│   │   └── PlaybackContext.jsx
│   │
│   ├── pages/
│   │   ├── genre/
│   │   │   ├── Genre.jsx
│   │   │   └── GenreList.jsx
│   │   │
│   │   ├── Shows/
│   │   │   ├── Episodes.jsx
│   │   │   ├── FavoriteShows.jsx
│   │   │   ├── Seasons.jsx
│   │   │   ├── ShowDetails.jsx
│   │   │   └── ShowList.jsx
│   │   │
│   │   ├── History.jsx
│   │   └── Home.jsx
│   │
│   ├── index.css
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── server.js
└── README.md


## 🧪 Usage Examples

- **Home Page**:  
  / → Visit the homepage to see featured contents and latest shows.

- **Search for a Show**:  
  /search?query=breaking+bad → Use the search bar to find shows by typing keywords like "breaking bad".

- **View Show Details**:
  /shows/:id → Click on a show to see detailed information, including seasons and episodes.

- **Browse by Genre**:  
  /genre → Genre list

- **View Shows by Genre**:  
  /genre/:genreId/shows → View all shows in a specific genre.

- **View Seasons**:  
  /shows/:id/season/:seasonNumber → View all episodes in a specific season of a show.

- **View and Play Episode**:  
  /shows/:id/season/:seasonNumber/episode/:episodeId → View details of a specific episode, including description and click play to start playback in the global player.

- **Global Player**:  
  The global player is always accessible at the bottom of the page, allowing users to control playback of episodes from anywhere in the app.

- **Manage Favorites**:
  /favourites → View and manage your favorite shows.

- **View Listening History**:
  /history → View listening history.

- **User Authentication**:  
  /login → Log in to your account.
    /register → Create a new account.


## ✅ Technologies Used
- React

- React Router DOM

- Context API (for global state management)

- Vite/Webpack (based on setup)

- JSX/ES6+ (for modern JavaScript syntax)

- CSS Modules (for scoped styling)

- Fetch API (for data fetching)


## 📬 Contact
Have questions, feedback, or want to contribute?

Maintainer: [Uchechukwu Udefi](https://github.com/Uchechukwu-Udefi)
📧 Email: [udefihenry@gmail.com](mailto:udefihenry@gmail.com)
🌐 GitHub: https://github.com/Uchechukwu-Udefi

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

