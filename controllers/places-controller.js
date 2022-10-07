const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const getCoordsForAdress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "title1",
    description: "description1",
    location: {
      lat: 10,
      lng: 10,
    },
    address: "address1",
    creator: "u1",
  },
];

async function getPlaceById(req, res, next) {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(error);
  }
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided place id", 404)
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
}

async function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(error);
  }
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id", 404)
    );
  }
  res.json({ places: places.map((p) => p.toObject({ getters: true })) });
}

async function createPlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs.", 422));
  }
  const { title, description, image, address, creator } = req.body;
  let location;
  try {
    location = await getCoordsForAdress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location,
    image,
    creator,
  });

  try {
    await createdPlace.save();
  } catch (error) {
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
}

async function updatePlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs.", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(error);
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (error) {
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
}

async function deletePlace(req, res, next) {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(error);
  }
  try {
    await place.remove();
  } catch (error) {
    return next(error);
  }
  res.json({ message: "Deleted place." });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
