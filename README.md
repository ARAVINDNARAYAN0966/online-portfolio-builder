# CreatorPort - Freelancer Portfolio Builder

A full-stack (MERN) platform empowering freelancers and creators to build, manage, and share their professional portfolios with ease.

## 🚀 Features

- **Robust Authentication**: Secure user login and registration system with password strength validation and "Remember Me" functionality.
- **Dynamic Portfolio Management**: Create, edit, and delete portfolio items seamlessly.
- **Modern User Interface**: A beautifully crafted, responsive design featuring glassmorphism elements, vibrant color palettes, and dark mode for a premium user experience.
- **Global Reach**: Extensive 200+ country selection integration for users to localize their profiles.
- **Real-time Previews**: Instantly see how your portfolio looks to potential clients.

## 💻 Tech Stack

**Frontend:**
- React (via Vite)
- Vanilla CSS with modern aesthetics (Flexbox/Grid, Animations, Glassmorphism)
- React Router DOM for seamless navigation

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose for persistent data storage
- JSON Web Tokens (JWT) & bcrypt for secure authentication
- CORS for cross-origin resource sharing

## 🛠️ Installation & Setup

### Prerequisites
- Node.js installed on your machine
- MongoDB instance (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/ARAVINDNARAYAN0966/online-portfolio-builder.git
cd online-portfolio-builder
```

### 2. Install Backend Dependencies
```bash
# In the root directory
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 5. Run the Application

You can start both the frontend and backend servers.

**Terminal 1 (Backend):**
```bash
# In the root directory
node server.js
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend will run on `http://localhost:5000`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
