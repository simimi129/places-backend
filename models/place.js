const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  lat: { tpye: Number },
  lng: { tpye: Number },
});

const placeSchema = new Schema({
  title: String,
  description: String,
  image: String,
  addres: String,
  location: locationSchema,
  creator: String,
});

module.exports = mongoose.model("Place", placeSchema);
