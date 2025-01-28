import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: ["https://job-portal-11-wnse.onrender.com"],
  credentials: true,
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}

// API routes
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);



if (process.env.NODE_ENV === "production") {
  const dirpath = path.resolve();
  app.use(express.static('./Frontend/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(dirpath,'./Frontend/dist', 'index.html'));
  });
}



// Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  });
