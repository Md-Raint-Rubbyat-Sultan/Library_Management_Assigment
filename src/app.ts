import express, { Application, NextFunction, Request, Response } from "express";

const app: Application = express();
app.use(express.json());

// test route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).send({
      message: "Welcome to Tech Fuko API",
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
  });
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({
    message: "Unable to find the requested resource",
    success: false,
    error: error.message || "Internal Server Error",
  });
});

export default app;
