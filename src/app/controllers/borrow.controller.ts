import express, { Request, Response, NextFunction } from "express";
import Borrow from "../models/borrow.model";
import Book from "../models/book.model";

const borrowRouter = express.Router();

borrowRouter.post(
  "/borrow",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { book, quantity, dueDate } = req.body;

      // Validate required fields
      if (!book || !quantity || !dueDate) {
        return res.status(400).send({
          success: false,
          message: "All fields are required",
          error: "Validation Error",
        });
      }

      // Validate quantity
      const isEnoughCopies = await Book.findOne({
        _id: book,
        copies: { $gte: quantity },
      });

      if (!isEnoughCopies) {
        return res.status(400).send({
          success: false,
          message: "Not enough copies available",
          error: "Validation Error",
        });
      }

      // Create a new borrow instance
      const newBorrow = new Borrow({
        book,
        quantity,
        dueDate,
      });

      await newBorrow.save();

      //   need to create the instace of the book model here

      // Send the borrow data
      res.status(201).send({
        success: true,
        message: "Book borrowed successfully",
        data: newBorrow,
        isEnoughCopies: isEnoughCopies.copies - 2, // gives the updated number of copies
      });
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  }
);

export default borrowRouter;
