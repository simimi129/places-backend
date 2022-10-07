const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  image: String,
  places: [{ type: mongoose.Types.ObjectId, ref: "Place" }],
});

module.exports = mongoose.model("User", userSchema);
