import express, { Request, Response, NextFunction } from "express";
import Borrow from "../models/borrow.model";
import Book from "../models/book.model";

const borrowRouter = express.Router();

// Route to create a new borrow
borrowRouter.post(
  "/borrow",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { book, quantity, dueDate } = req.body;

      // check all required fields
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
        copies: { $gte: Number(quantity) },
      });

      if (!isEnoughCopies) {
        return res.status(200).send({
          success: false,
          message: "Not enough copies available",
        });
      }

      // Create a new borrow instance
      const newBorrow = new Borrow({
        book,
        quantity,
        dueDate,
      });

      await newBorrow.save();

      // Update the book's available copies
      if (isEnoughCopies && isEnoughCopies.copies - Number(quantity) === 0) {
        isEnoughCopies.availablity(Number(quantity));
      }

      // Send the borrow data
      res.status(201).send({
        success: true,
        message: "Book borrowed successfully",
        data: newBorrow,
      });
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  }
);

// Route to get borrowed books summary
borrowRouter.get(
  "/borrow",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Aggregate borrowed books summary
      const borrowedBooksSummary = await Borrow.aggregate([
        {
          $lookup: {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "book",
          },
        },
        {
          $unwind: "$book",
        },
        {
          $group: {
            _id: "$book._id",
            book: { $first: { title: "$book.title", isbn: "$book.isbn" } },
            totalQuantity: { $sum: "$quantity" },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ]);

      // send the summary data
      res.status(200).send({
        success: true,
        message: "Borrowed books summary retrieved successfully",
        data: borrowedBooksSummary,
      });
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  }
);

export default borrowRouter;
