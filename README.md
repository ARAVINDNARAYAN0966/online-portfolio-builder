# ✨ CreatorPort: Online Portfolio Builder

A vibrant, dynamic web platform designed for freelancers and creators to build, showcase, and filter professional portfolios.

## 🌟 Features
- **User Authentication**: Secure Login & Sign Up portals using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Dynamic Portfolios**: Create and edit your own portfolio with your skills, bio, theme colors, and social links.
- **Interactive Filtering**: Potential clients can filter freelancers by Industry (Design, Development, Marketing, etc.) and specific Services.
- **Dark / Light Mode**: A beautifully integrated theme toggle that remembers user preferences.
- **Premium UI/UX**: Built with custom Vanilla CSS featuring glassmorphism, gradients, hover effects, and modern typography (`Outfit` and `Inter` fonts).

## 🛠️ Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript.
- **Backend**: Node.js and Express.js
- **Database**: Local JSON File (`database.json`) - Zero setup required!
- **Security**: `jsonwebtoken` (JWT) for sessions, `bcryptjs` for password hashing.

## 🚀 Step-by-Step Overview (How it works)
1. **Discover**: The homepage dynamically fetches all published freelancer portfolios from the backend and displays them in a responsive grid.
2. **Filter**: Clicking on an industry or service in the sidebar sends a filtered request to the Express API to instantly update the grid without reloading the page.
3. **Register / Login**: Users can sign up via the Auth Modal. Passwords are encrypted before being saved. Upon successful login, a JWT is securely stored in the browser's `localStorage`.
4. **Profile Management**: Logged-in users can update their contact info (Mobile, Address, LinkedIn, GitHub) securely.
5. **Publishing**: Users fill out their industry, skills, and bio in the "Manage Portfolio" modal. This data is associated with their account in the backend database and immediately broadcasted to the public discovery page.

## 💻 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ARAVINDNARAYAN0966/online-portfolio-builder.git
   cd online-portfolio-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **View the site:**
   Open your web browser and navigate to `http://localhost:3000`.
