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
const book_model_1 = __importDefault(require("../models/book.model"));
const bookRequest = express_1.default.Router();
// Route to create a new book
bookRequest.post("/books", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, genre, isbn, description, copies, available = true, } = req.body;
        // check all required fields
        if (!title || !author || !genre || !isbn || !copies) {
            return res.status(400).send({
                success: false,
                message: "All fields are required",
                error: "Validation Error",
            });
        }
        // create a new book instance
        const newBook = new book_model_1.default({
            title,
            author,
            genre,
            isbn,
            description,
            copies,
            available,
        });
        yield newBook.save();
        // send the book data
        res.status(201).send({
            success: true,
            message: "Book created successfully",
            data: newBook,
        });
    }
    catch (error) {
        error.status = 500;
        next(error);
    }
}));
// Route to get all books
bookRequest.get("/books", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "asc", limit = 10, } = req.query;
        // filter validation
        let books;
        if (!filter || typeof filter !== "string") {
            books = yield book_model_1.default.find({})
                .sort({ [sortBy]: sort === "desc" ? -1 : 1 })
                .limit(Number(limit));
        }
        else {
            books = yield book_model_1.default.find({ genre: filter.toUpperCase() })
                .sort({ [sortBy]: sort === "desc" ? -1 : 1 })
                .limit(Number(limit));
        }
        // send the books data
        res.status(200).send({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        error.status = 404;
        next(error);
    }
}));
// Route to get a book by ID
bookRequest.get("/books/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        // find the book by ID
        const book = yield book_model_1.default.findById(bookId);
        // send the book data
        res.status(200).send({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        error.status = 404;
        next(error);
    }
}));
// Route to update a book by ID
bookRequest.put("/books/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const updatedDoc = req.body;
        // check if the updatedDoc has copies field
        if (updatedDoc === null || updatedDoc === void 0 ? void 0 : updatedDoc.copies) {
            // check copies a valid number and non-negative
            if (typeof updatedDoc.copies !== "number" || updatedDoc.copies < 0) {
                return res.status(400).send({
                    success: false,
                    message: "Copies must be a non-negative number",
                });
            }
            const book = yield book_model_1.default.findById(bookId);
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
        const updatedBook = yield book_model_1.default.findByIdAndUpdate(bookId, Object.assign({}, updatedDoc), { new: true });
        res.status(200).send({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        error.status = 500;
        next(error);
    }
}));
// Route to delete a book by ID
bookRequest.delete("/books/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        // find the book by ID and delete it
        const deletedBook = yield book_model_1.default.findByIdAndDelete(bookId);
        res.status(200).send({
            success: true,
            message: "Book deleted successfully",
            data: deletedBook,
        });
    }
    catch (error) {
        error.status = 500;
        next(error);
    }
}));
exports.default = bookRequest;
