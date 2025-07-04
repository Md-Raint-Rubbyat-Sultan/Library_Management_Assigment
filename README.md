# Library Management Assignment

A simple CRUD-based REST API for managing a library system using **Node.js**, **TypeScript**, **Express**, and **Mongoose**.

🔗 **Live Link:** [https://librarymanagementassigment.vercel.app/](https://librarymanagementassigment.vercel.app/)

## Features

- Manage books and borrow records
- Full CRUD operations for books
- POST/GET operations for borrow records
- MongoDB document relationships with reference
- Custom schema methods and post-middleware
- Aggregation pipeline used in borrow creation

## API Details

- POST (/api/books) A post method that will create a Book Doc.
- GET (/api/books) A get method that will show books with some qurey parameter. (eg. /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5)
- GET (/api/books/:bookId) A get method for retriving single book doc.
- PUT (/api/books/:bookId) A put method for update book doc.
- DELETE (/api/books/:bookId) A delete method that will delete a single book doc.
- POST (/api/borrow) A post mthod that will store info about a borrowed book.
- GET (/api/borrow) A get method where aggregation piple has been used to achive info about the total number of borrow a book.

## Setup instructions

- Install Dependencies: npm install
- Make .env file and put your mongodb uri as (DB_URI=urilink)
- In Command line type npm run dev

Your are good to go with the project
