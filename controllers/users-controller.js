const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

async function getUsers(req, res, next) {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(error);
  }
  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
}

async function signup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs.", 422));
  }
  const { name, email, password } = req.body;
  let hasUser;
  try {
    hasUser = await User.findOne({ email: email });
  } catch (error) {
    return next(error);
  }
  if (hasUser) {
    return next(new HttpError("User already exists"), 422);
  }
  const createdUser = new User({
    name,
    email,
    password,
    image: "asd",
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (error) {
    return next(error);
  }
  if (!user || user.password !== password) {
    return next(new HttpError("Invalid credentials", 422));
  }
  res.json({ message: "Logged in." });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
