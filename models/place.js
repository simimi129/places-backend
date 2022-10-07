const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { tpye: String, required: true },
  image: { type: String, required: true },
  addres: { types: String, required: true },
  location: {
    lat: { tpye: Number, required: true },
    lng: { tpye: Number, required: true },
  },
  creator: { type: String, required: true },
});

module.exports = mongoose.model("Place", placeSchema);
