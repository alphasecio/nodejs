const User = require("../models/user");

function handleGetUserSignin(req, res) {
  return res.render("signin");
}

async function handlePostUserSignin(req, res) {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Incorrect Email or Password" });
  }
}

function handleGetUserSignup(req, res) {
  return res.render("signup");
}

async function handlePostUserSignup(req, res) {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });
  return res.redirect("/");
}

function handleUserLogout(req, res) {
  return res.clearCookie("token").redirect("/");
}

module.exports = {
  handleGetUserSignin,
  handlePostUserSignin,
  handleGetUserSignup,
  handlePostUserSignup,
  handleUserLogout,
};
