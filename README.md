# 🎵 U-TUNE PODCAST APP | PORTFOLIO PIECE 💿

A full-featured React web application for browsing, viewing, and managing podcast shows. Users can search shows, explore by genre, view detailed season and episode info, manage favorite shows, view and manage listening history, and enjoy in-app audio playback — all within a seamless experience using modern React features and routing.


## App Review
### Video Demo
https://www.loom.com/share/7617d19fb72e44ee8875161e7afc4683?sid=9e293fb1-4077-450c-aa38-8e89223c8e1a
### Code Reviews
[[Watch code review 1]](https://www.loom.com/share/823bf52823974b43aec2bc22f79fbd37?sid=aba35115-fe5d-4f23-be76-ce9ca0b2b28f)
[[Watch code review 2]](https://www.loom.com/share/5e5ddcd9c1744a84880a514ce40b79f8?sid=781fc283-21ed-407b-9fb7-31010a809fdc)
[[Watch code review 3]](https://www.loom.com/share/70f2aac18d034480bf0d77dff0c46b4b?sid=a249c030-707a-4882-80e9-fc0bb16fcf0a)
[[Watch code review 4]](https://www.loom.com/share/652c95e5b6cd47b79248b45da19dbc7a?sid=eefbbeb1-1338-412d-88b0-6fd6d8ec1467)
[[Watch code review 5]](https://www.loom.com/share/ef69decb32bb43b6b86ee772dc7e5838?sid=cd93f086-fc97-4648-8313-a2c1acf7ceee)
[[Watch code review 6]](https://www.loom.com/share/82ee2a847c4142c9b525fa4f6c255650?sid=3b48c5d0-8eec-44a2-b160-4f6a4bedfe5f)


## Live Demo
Experience the app live at: [https://u-tune.netlify.app/](https://u-tune.netlify.app/)

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

``` plaintext
Uchechukwu-Udefi-Podcast-App/
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
│   │   ├── BackButton.jsx
│   │   ├── BackToTopButton.jsx
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
```
## 📖 Documentation
This project is structured to provide a clear separation of concerns, with components for UI elements, context for global state management, and pages for different routes in the application. The `assets` directory contains images used throughout the app, while the `public` directory holds static files like the favicon and redirects.


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


## 📸 Screenshots
[[Screenshot 1](assets/images/lg-screen.jpg)]
[[Screenshot 2](assets/images/md-screen.jpg)]
[[Screenshot 3](assets/images/sm-screen.jpg)]
[[Screenshot 4](assets/images/loading.jpg)]


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

