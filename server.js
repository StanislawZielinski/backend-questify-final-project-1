require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const { DB_HOST } = process.env;

mongoose
	.connect(DB_HOST)
	.then(() => {
		console.log("Database connection successful");
		console.log("App is running on address: http://localhost:3000/");
		app.listen(process.env.PORT || 3000);
	})
	.catch(error => {
		console.log(error);
		process.exit(1);
	});
