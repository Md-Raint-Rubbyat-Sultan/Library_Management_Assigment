"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const borrow_model_1 = __importDefault(require("../models/borrow.model"));
const book_model_1 = __importDefault(require("../models/book.model"));
const borrowRouter = express_1.default.Router();
// Route to create a new borrow
borrowRouter.post("/borrow", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const isEnoughCopies = yield book_model_1.default.findOne({
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
        const newBorrow = new borrow_model_1.default({
            book,
            quantity,
            dueDate,
        });
        yield newBorrow.save();
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
    }
    catch (error) {
        error.status = 500;
        next(error);
    }
}));
// Route to get borrowed books summary
borrowRouter.get("/borrow", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Aggregate borrowed books summary
        const borrowedBooksSummary = yield borrow_model_1.default.aggregate([
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
    }
    catch (error) {
        error.status = 500;
        next(error);
    }
}));
exports.default = borrowRouter;
