# Full-Stack Project Setup Guide

by aditi

## Project Overview  
This project is a full-stack application consisting of an **Angular frontend** and an **Express backend**. The Angular frontend serves a client-side application, while the Express backend handles API requests and server-side logic.  

### **Project Structure**
```
Parent Folder
│
├── client (Angular Frontend)
│   ├── src
│   │   └── (Angular application source files)
│   ├── package.json
│   └── angular.json
│
└── server (Express Backend)
    ├── src
    │   └── app-server.ts (Main server file)
    ├── package.json
    └── tsconfig.json
```

---

## **Prerequisites**
Before running this project, ensure you have the following installed:  
- **Node.js** (v14.x or higher)  
- **npm** (Node Package Manager)  
- **Angular CLI** (v15 or higher)  

---

## **Setup Instructions**

### 1. Clone the Repository
```sh
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

#### **Frontend (Angular)**
```sh
cd client
npm install
```

#### **Backend (Express)**
```sh
cd ../server
npm install
```

---

## **Development**

### **Running the Frontend (Angular)**  
The frontend will be served at `http://localhost:6900/`.  
```sh
cd client
ng serve
```

### **Running the Backend (Express)**  
The backend will run on `http://localhost:4200/` by default.  
```sh
cd server
npm start
```

### **Frontend and Backend in Parallel**  
You can run both in separate terminals:  
```sh
# Terminal 1 (Frontend)
cd client
ng serve
```

```sh
# Terminal 2 (Backend)
cd server
npm start
```

---

## **Build for Production**

### **Frontend Build**  
To build the Angular project for production:  
```sh
cd client
ng build
```
The built files will be generated in the `dist/client` directory.

### **Backend Build (Typescript Compilation)**  
```sh
cd server
tsc
```
The compiled JavaScript files will be in the `built` directory.

---

## **Directory Explanation**

### **Frontend (`client`)**
- **`src/`**: Contains Angular application source files.  
- **`angular.json`**: Angular CLI configuration file.  
- **`package.json`**: Specifies dependencies and scripts for Angular development.  

#### Key Scripts:
- `npm start` or -`ng serve`: Starts the Angular development server at `http://localhost:6900/`.  
- `npm run build` or -`ng build`: Builds the Angular project for production.  

### **Backend (`server`)**
- **`src/app-server.ts`**: Main server file for the Express backend.  
- **`package.json`**: Specifies dependencies and scripts for the server.  
- **`tsconfig.json`**: TypeScript configuration file for the backend.  

#### Key Scripts:
- `npm start`: Starts the server using `nodemon`. The server will auto-restart on file changes.  
- `npm run fresh`: Clears the terminal and starts the server.  
- `npm run setup`: Installs dependencies and starts the server.  

---

## **How It Works**

### **Frontend**  
The Angular frontend is a Single Page Application (SPA) that provides the user interface. It communicates with the backend through REST API calls to perform operations like data fetching, updating, and deleting.  

### **Backend**  
The Express backend serves as a REST API, handling business logic and data management. It connects to a MongoDB database using **Mongoose** for CRUD operations. The backend also supports environment-based configurations using **dotenv**.

---

## **Technologies Used**

### **Frontend (Angular)**  
- Angular 19  
- Angular Material 19(UI components)  
- RxJS (Reactive programming)  

### **Backend (Express)**  
- Express.js  
- Mongoose (MongoDB ODM)  
- TypeScript  
- Nodemon (for development)  

---

## **Future Enhancements**  
- Add authentication and authorization.  
- Implement advanced error handling.  
- Improve UI with lazy loading and responsive design.  

