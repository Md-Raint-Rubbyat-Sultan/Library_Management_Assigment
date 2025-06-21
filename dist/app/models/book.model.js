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
const mongoose_1 = require("mongoose");
const borrow_model_1 = __importDefault(require("./borrow.model"));
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
        type: String,
        required: true,
        enum: [
            "FICTION",
            "NON_FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
        uppercase: true,
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String, default: "NO DESCRIPTION FOUND", trim: true },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false,
});
bookSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        yield borrow_model_1.default.deleteMany({
            book: doc._id,
        });
    });
});
bookSchema.method("availablity", function () {
    return __awaiter(this, arguments, void 0, function* (borrowedCopies = 0) {
        this.copies -= borrowedCopies;
        if (this.copies === 0) {
            this.available = false;
            yield this.save();
        }
    });
});
const Book = (0, mongoose_1.model)("Book", bookSchema);
exports.default = Book;
