const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users.js");
const categoryRouter = require("./routes/category.js");
const quizRouter = require("./routes/quiz.js");

const app = express();

app.use(express.json());

mongoose.connect(
  "mongodb://127.0.0.1:27017/crud-try",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(userRouter);
app.use(categoryRouter);
app.use(quizRouter);

app.listen(3000, () => {
  console.log("Server is running...");
});