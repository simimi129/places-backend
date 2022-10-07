const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

function getUsers(req, res, next) {
  res.json({ users: DUMMY_USERS });
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

function login(req, res, next) {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("Could not identify user", 401));
  }

  res.json({ message: "Logged in." });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
