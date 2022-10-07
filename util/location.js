const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyBpmFpnEH1pzflf8lxqF61b_ACQjriMTJo";

async function getCoordsForAdress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    return next(new HttpError("Coluld not find address.", 422));
  }
  const location = data.results[0].geometry.location;
  return location;
}

module.exports = getCoordsForAdress;
