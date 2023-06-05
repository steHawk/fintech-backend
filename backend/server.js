import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import borrowerRoutes from "./routes/borrowerRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

connectDB();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/borrowers", borrowerRoutes);
app.use("/api/service", serviceRoutes);

app.use(express.urlencoded({ extended: true }));

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => res.send("Server is Ready"));

app.listen(port, () => console.log(`Server started on port ${port}`));
