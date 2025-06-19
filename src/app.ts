import express, { Application, NextFunction, Request, Response } from "express";
import bookRequest from "./app/controllers/book.controllers";
import borrowRouter from "./app/controllers/borrow.controller";

const app: Application = express();
app.use(express.json());

app.use("/api", bookRequest);
app.use("/api", borrowRouter);

// test route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).send({
      message: "Welcome to Library Management API",
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
});

// 404 route handler
app.use((req: Request, res: Response) => {
  res.status(404).send({
    message: `Route: ${req.originalUrl} not found`,
    success: false,
    error: "Not Found",
  });
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error.status);
  res.status(error?.status || 500).send({
    message: `Unable to find the requested resource ${req.originalUrl}`,
    success: false,
    error: error?.message || "Internal Server Error",
  });
});

export default app;
