const express = require("express");
const categoriesRouter = require("./Routes/categories");
const studentsRouter = require("./Routes/students");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/elearningPlatform")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB", err);
  });

app.use(express.json());
app.use("/api/categories", categoriesRouter);
app.use("/api/students", studentsRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => console.log("server is running on port localhost:3000"));
