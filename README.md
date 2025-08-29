# Learn At - E-Learning Platform

**Learn At** is a modern e-learning application designed to provide a seamless learning experience for students and instructors. Users can browse and enroll in courses, interact with instructors via chat or video calls, and submit course reviews. Instructors can create and manage courses, host live video sessions, and communicate with students in real-time. Admins have full control over the platform, including user management, course oversight, and category management.  

Built with the **MERN stack (MongoDB, Express.js, React.js, Node.js)**, Learn At also includes features like Google authentication, role-based access, real-time chat, video call functionality, and responsive design for all devices.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

### User Features
- Sign up and login (including Google OAuth)
- Browse courses by instructors
- Enroll in courses
- Submit reviews and ratings
- View related courses
- Real-time chat with instructors
- **One-to-one and group video calls with instructors**
- View own dashboard with enrolled courses

### Instructor Features
- Create and manage courses
- View student reviews
- Manage course content
- Real-time communication with students
- **Host live video sessions for students**

### Admin Features
- Manage users and instructors
- Ban/unban users
- Manage categories and courses
- View reviews and statistics

### Other Features
- Pagination for courses and reviews
- Soft delete and recovery for categories/products
- Responsive design using **Bootstrap** and **Tailwind CSS**
- Security enhancements using **Helmet** and **CORS**

---

## Tech Stack

- **Frontend:** React.js, Redux (optional), Bootstrap, Tailwind CSS
- **Backend:** Node.js, Express.js, Passport.js (Google OAuth)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, Google OAuth 2.0
- **Real-time Features:** Socket.io (chat & video calls)
- **Other Tools:** Nodemailer, Postman for API testing

---

## Getting Started

### Prerequisites
- Node.js >= 16.x
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/adarsh6282/LearnAt---E-Learning-Platform
cd LearnAt
**\`\`\`**


2. **Install backend Dependencies**

cd backend
npm install

