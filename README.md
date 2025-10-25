# 🍽️ PleaseEat Backend

A personal learning project focused on improving **backend development skills** by building a simple, well-structured **Node.js + Express + MongoDB** API for restaurant and recipe management.

This project is not intended for production but serves as a sandbox for exploring best practices in **API design**, **data validation**, **schema modelling**, and **testing**.

---

## 🚀 Features

* **Express.js REST API** following clean and modular architecture
* **MongoDB (Mongoose)** for data persistence
* **AJV** for runtime input and output validation using JSON Schema
* **TypeScript** for type safety and maintainable code
* **MVC-inspired structure** separating controllers, models, and routes
* CRUD operations for recipe data (Create, Read All, Read by ID, etc.)
* **Environment variable management** using dotenv
* Future testing setup planned with **Mocha + Chai**

---

## 🧩 Project Structure

```
PleaseEat/
├── src/
│   ├── action/             # Business Logic
│   ├── db/                 # Database connection and operations
│   ├── schema/             # Input/output validation schemas (using AJV)
│   ├── controllers/        # Call the functions to run business logic
│   ├── routes/             # Express routes and endpoints
│   ├── models/             # Models for database
│   ├── middlewares/        # Validation function for all the functions and else
│   └── index.ts            # Entry point
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js** (v18+ recommended)
* **npm** or **yarn**
* **MongoDB** (local or cloud instance such as MongoDB Atlas)

### Installation

```shell
# Clone the repository
git clone https://github.com/mmkk28/PleaseEat.git
cd PleaseEat

# Install dependencies
npm install

# Create a .env file
touch .env
```

Add your environment variables in `.env`:

```
MONGO_URI=mongodb+srv://<your-connection-string>
PORT=3000
```

### Running the Project

```bash
# Run in development mode with hot reload (if nodemon is installed)
npm run dev

# Or run directly
npm start
```

---

## 🧪 Example Endpoints

**GET all recipes**

```shell
GET /api/recipes
```

**GET a recipe by ID**

```shell
GET /api/recipes/:id
```

**POST a new recipe**

```shell
POST /api/recipes
{
  "title": "Omelet",
  "ingredients": ["egg", "oil", "soy sauce"],
  "instructions": "Beat eggs and fry until golden."
}
```

---

## 🧠 Purpose

This repository is part of a personal journey to:

* Practise designing scalable backend architecture.
* Learn how to enforce data validation using AJV.
* Gain experience working with MongoDB and TypeScript.
* Prepare for building more complex full-stack applications.

---

## 🧹 Future Improvements

* Add **update** and **delete** recipe functions.
* Integrate **Mocha + Chai** for unit and integration testing.
* Add pagination and filtering to the recipe listing endpoint.
* Enhance error handling and logging for production-like scenarios.
