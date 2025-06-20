import express, { Request, Response, NextFunction } from "express";
import Book from "../models/book.model";

const bookRequest = express.Router();

// Route to create a new book
bookRequest.post(
  "/books",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        title,
        author,
        genre,
        isbn,
        description,
        copies,
        available = true,
      } = req.body;

      // check all required fields
      if (!title || !author || !genre || !isbn || !copies) {
        return res.status(400).send({
          success: false,
          message: "All fields are required",
          error: "Validation Error",
        });
      }

      // create a new book instance
      const newBook = new Book({
        title,
        author,
        genre,
        isbn,
        description,
        copies,
        available,
      });

      await newBook.save();

      // send the book data
      res.status(201).send({
        success: true,
        message: "Book created successfully",
        data: newBook,
      });
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  }
);

// Route to get all books
bookRequest.get(
  "/books",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        filter,
        sortBy = "createdAt",
        sort = "asc",
        limit = 10,
      } = req.query;

      // filter validation
      let books: unknown;
      if (!filter || typeof filter !== "string") {
        books = await Book.find({})
          .sort({ [sortBy as string]: sort === "desc" ? -1 : 1 })
          .limit(Number(limit));
      } else {
        books = await Book.find({ genre: filter.toUpperCase() })
          .sort({ [sortBy as string]: sort === "desc" ? -1 : 1 })
          .limit(Number(limit));
      }

      // send the books data
      res.status(200).send({
        success: true,
        message: "Books retrieved successfully",
        data: books,
      });
    } catch (error: any) {
      error.status = 404;
      next(error);
    }
  }
);

// Route to get a book by ID
bookRequest.get(
  "/books/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.params;

      // find the book by ID
      const book = await Book.findById(bookId);

      // send the book data
      res.status(200).send({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (error: any) {
      error.status = 404;
      next(error);
    }
  }
);

// Route to update a book by ID
bookRequest.put(
  "/books/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.params;
      const updatedDoc = req.body;

      // check if the updatedDoc has copies field
      if (updatedDoc?.copies) {
        // check copies a valid number and non-negative
        if (typeof updatedDoc.copies !== "number" || updatedDoc.copies < 0) {
          return res.status(400).send({
            success: false,
            message: "Copies must be a non-negative number",
          });
        }

        const book = await Book.findById(bookId);
        if (!book) {
          return res.status(404).send({
            success: false,
            message: "Book not found",
          });
        }
        updatedDoc.copies += book.copies;
        updatedDoc.available = updatedDoc.copies > 0;
      }

      // find the book by ID and update it
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { ...updatedDoc },
        { new: true }
      );

      res.status(200).send({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  }
);

// Route to delete a book by ID
bookRequest.delete(
  "/books/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.params;

      // find the book by ID and delete it
      const deletedBook = await Book.findOneAndDelete({ _id: bookId });

      res.status(200).send({
        success: true,
        message: "Book deleted successfully",
        data: deletedBook,
      });
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  }
);

export default bookRequest;
