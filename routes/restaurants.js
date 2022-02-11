const express = require("express");
const uuid = require("uuid");

const restaurantData = require("../util/restaurant-data");

const router = express.Router();

router.get("/restaurants", function (req, res) {
  let order = req.query.order;
  let nextOrder = "desc";

  if (order !== "asc" && order !== "desc") {
    order = "asc";
  }

  if (order === "desc") {
    nextOrder = "asc";
  }

  const storedRestaurants = restaurantData.getStoredRestaurants();

  // storedRestaurants.sort(function (resA, resB) {
  //   if (resA.name > resB.name) {
  //     return 1;
  //   }
  //   return -1;
  // });
  // this sort function basically will search who gonna win
  // we sort if by alphabect and by ascending
  // if we do resA.name > resB.name and return 1
  // will give us an output with alphabetly from A to Z
  // so the return 1 win, if we do resA.name > resB.name and return -1, we will get the otherwise results

  storedRestaurants.sort(function (resA, resB) {
    if (
      (order !== "asc" && resA.name > resB.name) ||
      (order !== "desc" && resB.name > resA.name)
    ) {
      return 1;
    }
    return -1;
  });

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    nextOrder: nextOrder,
  });
});

router.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id;

  const storedRestaurants = restaurantData.getStoredRestaurants();

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurant-detail", { restaurant: restaurant });
    }
  }

  res.status(404).render("404");
});

router.get("/recommend", function (req, res) {
  res.render("recommend");
});

router.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4();
  const restaurants = restaurantData.getStoredRestaurants();

  restaurants.push(restaurant);

  restaurantData.storeRestaurants(restaurants);

  res.redirect("/confirm");
});

router.get("/confirm", function (req, res) {
  res.render("confirm");
});

module.exports = router;
