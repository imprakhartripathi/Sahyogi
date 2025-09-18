---
description: Repository Information Overview
alwaysApply: true
---

# Sahyogi Repository Information

## Repository Summary
Sahyogi is an AI-powered task and project management tool inspired by Jira, designed for efficient project tracking and task management. It provides a streamlined interface to organize tasks, track progress, and gain AI-driven insights for better productivity.

## Repository Structure
- **client/**: Angular 19 frontend application
- **server/**: Express.js (Node.js) backend server
- **serverai/**: Django-based AI server component
- **docker-compose.yml**: Docker configuration for multi-container setup

## Projects

### Angular Frontend (client)
**Configuration File**: package.json, angular.json

#### Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.6.2
**Build System**: Angular CLI
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- Angular 19.0.0 (core, animations, forms, router, etc.)
- Angular Material 19.1.2
- RxJS 7.8.0
- Express 4.18.2 (for SSR)

**Development Dependencies**:
- Angular CLI 19.0.6
- Jasmine/Karma for testing
- TypeScript 5.6.2

#### Build & Installation
```bash
cd client
npm install
ng serve  # Development server on port 6900
ng build  # Production build
```

#### Docker
**Dockerfile**: dockerfile
**Image**: node:20-alpine
**Configuration**: Exposes port 5000, mounts source code as volume for development

#### Testing
**Framework**: Jasmine/Karma
**Test Location**: Typically in *.spec.ts files alongside components
**Run Command**:
```bash
cd client
npm test
```

### Express Backend (server)
**Configuration File**: package.json, tsconfig.json

#### Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.7.2
**Build System**: ts-node (development), tsc (production)
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- Express 4.21.2
- MongoDB 6.14.2
- Mongoose 8.9.6
- JWT 9.0.2
- bcryptjs 2.4.3
- Google Generative AI 0.21.0
- OpenAI 4.86.1
- dotenv 16.4.7

**Development Dependencies**:
- nodemon 3.1.9
- ts-node 10.9.2
- TypeScript type definitions

#### Build & Installation
```bash
cd server
npm install
npm start  # Development server with nodemon
tsc  # Production build (outputs to built/ directory)
```

#### Docker
**Dockerfile**: dockerfile
**Image**: node:20-alpine
**Configuration**: Exposes port 4200

### Django AI Server (serverai)
**Configuration File**: settings.py

#### Language & Runtime
**Language**: Python
**Version**: Python 3.x (Django 5.2)
**Build System**: Django
**Database**: SQLite3

#### Dependencies
**Main Dependencies**:
- Django 5.2
- Django REST framework (implied)

#### Build & Installation
```bash
cd serverai
python manage.py runserver
```

## Docker Configuration
**Docker Compose**: docker-compose.yml
**Services**:
- client: Angular frontend (port 5000)
- server: Express backend (port 4200)

**Development Setup**:
```bash
docker-compose up
```