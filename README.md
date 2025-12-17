LearnHub Backend API

LearnHub Backend API is a backend service designed as the core API for the entire LearnHub application ecosystem.
This API is not tied to a single frontend, allowing it to be used by multiple LearnHub applications, including:

🌐 Web Applications

📱 Mobile Applications (Android / iOS)

Admin Dashboard

This API acts as the single source of truth for all LearnHub data and business processes.

Project Purpose

This project was created to:
Provide a centralized API for all LearnHub applications
Separate backend business logic from frontend implementations
Enable efficient multi-platform application development
Serve as a scalable, modular, and reusable backend foundation
With this approach, one backend API can serve multiple LearnHub applications without the need to build separate backends.

All LearnHub applications communicate with the same API, using consistent endpoints and business rules.

Core API Features
Authentication & Authorization

User login and registration
Token-based authentication
Role & permission management (admin, user, etc.)

Learning Management

Courses and learning materials
Modules, content, and learning progress tracking

Reusable API Design

Generic and reusable endpoints
Independent of UI or platform implementation

Scalable & Modular Architecture

Easy to extend for future LearnHub features
Clean and maintainable code structure

🗂️ Project Structure (Simplified)
📦 LearnHub-Backend-System
 ┣ 📁 src               # Main source code
 ┣ 📁 api               # API modules / definitions
 ┣ 📁 docs              # API documentation
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┣ 📜 README.md

Technology Stack

Node.js
TypeScript
NestJS
RESTful API Architecture
Database (configurable per environment)

How to Use the API
Clone the Repository
git clone https://github.com/RakaPrasetyaHidayat/LearnHub-Backend-System.git
cd LearnHub-Backend-System

Install Dependencies
npm install

Environment Configuration

Create a .env file:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASS=your_password
JWT_SECRET=your_secret

Run the Server
npm run start:dev


The API will be available at:

http://localhost:3000/api/docs#/

🔌 Using the API for LearnHub Applications

This API can be consumed by:
LearnHub frontend applications (React / Vue / Next.js)
Mobile applications (Flutter / React Native)
Admin dashboards
Internal systems requiring LearnHub data
As long as an application can make HTTP requests, it can integrate with the LearnHub Backend API without platform limitations.

Tools Recomended
DB = Supabase
UI = Next.JS
Deployment = Vercel

Contribution

Contributions are welcome to help improve LearnHub.
Contribution steps:
Fork the repository
Create a feature branch
Commit your changes
Push to your fork
Create a Pull Request