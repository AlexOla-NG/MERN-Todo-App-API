const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// STUB: load environment variables
dotenv.config({ path: "./config/config.env" });

// STUB: connect to DB
connectDB();

// STUB: route files
const users = require("./routes/users");

// STUB: init express
const app = express();

// STUB: body parser
app.use(express.json());

// NOTE: setup middleware
// STUB: dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(cors());
// STUB: mount routers
app.use("/api/v1/users", users);

// STUB: custom error handler
// call this after mounting the routes, else it won't work
app.use(errorHandler);

// NOTE: use process.env to access environment variables
const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);

// STUB: handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
	console.log(`Error: ${err.message}`.red);

	// close server & exit process
	server.close(() => process.exit(1));
});
