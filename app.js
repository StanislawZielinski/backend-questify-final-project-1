const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const taskRouter = require("./routes/api/tasks");
const authRouter = require("./routes/api/auth");

const { useSwagger } = require("./swagger.js");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRouter);
app.use("/api/auth", authRouter);
useSwagger(app);

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

module.exports = app;
