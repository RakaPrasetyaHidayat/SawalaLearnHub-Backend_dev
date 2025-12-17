LearnHub Backend API
Overview

LearnHub Backend API is a centralized backend service designed as the core API layer for the entire LearnHub ecosystem.
It serves as the single source of truth for all LearnHub data, business logic, and system processes.

The API is frontend-agnostic, meaning it is not coupled to any specific client application. This enables seamless integration across multiple platforms while maintaining consistent business rules and data integrity.

LearnHub Backend API can be consumed by:

🌐 Web Applications

📱 Mobile Applications (Android / iOS)

🖥️ Admin Dashboards

By using a single backend API, LearnHub avoids duplicated logic, reduces technical debt, and ensures long-term scalability.

Project Goals & Design Philosophy

The primary goals of this project are:

Provide one centralized API for all LearnHub applications

Decouple backend business logic from frontend implementations

Enable multi-platform development using a shared API

Establish a scalable, modular, and maintainable backend architecture

Architectural Principle

One API → Multiple Applications

All LearnHub clients communicate with the same API, following consistent endpoints, validation rules, and authorization logic.
This ensures predictable behavior across platforms and simplifies long-term maintenance.

Core API Capabilities
Authentication & Authorization

Handles identity and access control across the LearnHub ecosystem.

User registration and login

Token-based authentication (JWT)

Role-based access control (e.g. admin, user)

Secure authorization for protected endpoints

Learning Management

Provides structured access to learning-related data and processes.

Courses and learning materials

Modular learning content

Learning progress tracking

Extensible structure for future learning features

Reusable & Platform-Agnostic API Design

RESTful endpoints designed for reuse

No dependency on UI or frontend frameworks

Consistent request and response contracts

Suitable for web, mobile, and internal services

Scalable & Modular Architecture

Feature-based module separation

Easy to extend without breaking existing clients

Clean, maintainable codebase using best practices

Designed for long-term growth of the LearnHub platform

Project Structure (Simplified)
📦 LearnHub-Backend-System
 ┣ 📁 src               # Main application source code
 ┣ 📁 api               # API modules and feature definitions
 ┣ 📁 docs              # API documentation and references
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┣ 📜 README.md


Each module is designed to be independent, making the system easier to scale and maintain.

Technology Stack

Node.js – JavaScript runtime

TypeScript – Strongly typed development

NestJS – Structured and scalable backend framework

RESTful API Architecture

Database – Configurable per environment (e.g. PostgreSQL)

Getting Started
1. Clone the Repository
git clone https://github.com/RakaPrasetyaHidayat/LearnHub-Backend-System.git
cd LearnHub-Backend-System

2. Install Dependencies
npm install

3. Environment Configuration

Create a .env file in the project root:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASS=your_password
JWT_SECRET=your_secret

4. Run the Development Server
npm run start:dev


Once running, the API will be accessible at:

http://localhost:3000

API Documentation

If Swagger is enabled, interactive API documentation will be available at:

http://localhost:3000/api/docs#/


The documentation provides:

Available endpoints

Request parameters

Response formats

Authentication requirements

Additional documentation may also be found in the docs/ directory.

API Usage Across LearnHub Applications

This API is designed to support various client applications, including:

LearnHub Web Applications (React / Vue / Next.js)

Mobile Applications (Flutter / React Native)

Admin Dashboards

Internal tools and services

As long as a client can perform HTTP requests, it can integrate with the LearnHub Backend API without platform restrictions.

Recommended Tooling & Infrastructure

Database: Supabase (PostgreSQL-based)

Frontend UI: Next.js

Deployment: Vercel

These tools complement the API architecture and support rapid development and scalability.

Contribution Guidelines

Contributions are welcome and encouraged.

To contribute:

Fork the repository

Create a feature branch

Commit your changes

Push to your fork

Submit a Pull Request

All contributions should follow the existing coding standards and architectural principles.

License

The license will be defined based on the future direction and distribution strategy of LearnHub.