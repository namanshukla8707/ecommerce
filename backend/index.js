// All the imports
const dotenv = require("dotenv");
const express = require("express");
const connectToMongo = require("./database");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
var cors = require("cors"); // This package connect client to backend-server
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
// Handling Uncaught Expection -- console.log(Youtube), where Youtube is undefined.
process.on("uncaughtException", (error) => {
  console.log(`Error: ${error.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// To use config.env file we have exported dotenv package and now giving path of the folder
dotenv.config({ path: "../backend/Config/config.env" });
const PORT_NO = process.env.PORT;

// Connecting to database
connectToMongo();


// Connecting backend to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Avaible Routes (using export routes and connecting them to main file)
app.use("/api/product", require("./Routes/productroute"));
app.use("/api/user", require("./Routes/userroute"));
app.use("/api/order", require("./Routes/orderroute"));

// Middleware for Errors
app.use(errorMiddleware);

// Listen to server
const server = app.listen(PORT_NO, () => {
  console.log(`Server is Working on ${PORT_NO} PORT`);
});

// Unhandled Promise Rejection -- server crash or closing it due to some issue in establishing connection to the server
process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
