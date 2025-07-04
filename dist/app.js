"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controllers_1 = __importDefault(require("./app/controllers/book.controllers"));
const borrow_controller_1 = __importDefault(require("./app/controllers/borrow.controller"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
}));
app.use(express_1.default.json());
app.use("/api", book_controllers_1.default);
app.use("/api", borrow_controller_1.default);
// test route
app.get("/", (req, res, next) => {
    try {
        res.status(200).send({
            message: "Welcome to Library Management API",
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
// 404 route handler
app.use((req, res) => {
    res.status(404).send({
        message: `Route: ${req.originalUrl} not found`,
        success: false,
        error: "Not Found",
    });
});
// Global error handler
app.use((error, req, res, next) => {
    console.log(error.status);
    res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send({
        message: `Unable to find the requested resource ${req.originalUrl}`,
        success: false,
        error: (error === null || error === void 0 ? void 0 : error.message) || "Internal Server Error",
    });
});
exports.default = app;
