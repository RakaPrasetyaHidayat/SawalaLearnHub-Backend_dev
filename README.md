LearnHub Backend API
Introduction

LearnHub Backend API is the core backend service that powers the entire LearnHub ecosystem.
It is designed as a centralized, platform-agnostic API that manages all business logic, data flow, and authorization rules across LearnHub applications.

Rather than building separate backends for each client, LearnHub adopts a single backend architecture, ensuring consistency, scalability, and long-term maintainability.

This API serves as the single source of truth for all LearnHub-related data and operations.

Supported Client Applications

The LearnHub Backend API can be consumed by multiple types of applications, including:

🌐 Web Applications

📱 Mobile Applications (Android / iOS)

🖥️ Admin Dashboards

🛠️ Internal tools and services

Any client capable of making HTTP requests can integrate with this API without platform restrictions.

Project Objectives

This project was built to achieve the following objectives:

Centralize all LearnHub backend logic into a single API

Decouple frontend implementations from backend business rules

Enable efficient development across multiple platforms

Provide a scalable, modular, and reusable backend foundation

Reduce duplication of logic and technical debt

Architectural Principle

One Backend API → Multiple Client Applications

All LearnHub applications communicate with the same API using consistent endpoints, validation rules, and authorization mechanisms.

Core Features
Authentication & Authorization

The API handles identity management and access control across the platform.

User registration and login

JWT-based authentication

Role-based access control (e.g. admin, user)

Secure authorization for protected endpoints

Learning Management

Provides structured access to learning-related resources and workflows.

Courses and learning materials

Modular learning content structure

Learning progress tracking

Designed to support future learning features

Platform-Agnostic API Design

RESTful endpoints designed for reuse

Independent of UI and frontend frameworks

Consistent request and response contracts

Suitable for web, mobile, and internal services

Scalable & Modular Architecture

Feature-based module separation

Easy to extend without breaking existing clients

Clean, maintainable codebase

Designed for long-term system growth

Project Structure
📦 LearnHub-Backend-System
 ┣ 📁 src               # Main application source code
 ┣ 📁 api               # Feature-based API modules
 ┣ 📁 docs              # API documentation
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┣ 📜 README.md


Each module is structured to promote separation of concerns and ease of maintenance.

Technology Stack

Node.js – JavaScript runtime

TypeScript – Strongly typed language for safer development

NestJS – Scalable backend framework

RESTful API Architecture

Database – Configurable per environment (e.g. PostgreSQL)

Getting Started
Clone the Repository
git clone https://github.com/RakaPrasetyaHidayat/LearnHub-Backend-System.git
cd LearnHub-Backend-System

Install Dependencies
npm install

Environment Configuration

Create a .env file in the project root:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASS=your_password
JWT_SECRET=your_secret

Run the Development Server
npm run start:dev


The server will start on:

http://localhost:3000

API Documentation

If Swagger is enabled, interactive API documentation is available at:

http://localhost:3000/api/docs#/


The documentation includes:

Available endpoints

Request and response schemas

Authentication requirements

Error responses

Additional documentation may be found inside the docs/ directory.

Recommended Stack for LearnHub Ecosystem

Database: Supabase (PostgreSQL)

Frontend: Next.js

Deployment: Vercel

This stack is recommended for optimal compatibility and scalability within the LearnHub ecosystem.

Contribution Guidelines

Contributions are welcome to improve and extend LearnHub.

Contribution process:

Fork the repository

Create a feature branch

Commit your changes

Push to your fork

Submit a Pull Request

Please ensure all contributions follow existing architectural and coding standards.

License

The license will be defined based on the future direction of the LearnHub project.