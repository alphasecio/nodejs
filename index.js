require("dotenv").config();

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { connectToMongoDB } = require("./connect");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT;
connectToMongoDB(process.env.MONGO_URL).then(() =>
  console.log("MongoDB Connected")
);

// app configurations
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public/")));

//routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
