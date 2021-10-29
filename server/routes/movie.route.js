const express = require("express");
const router = express.Router();

const {
    getMovie,
    addMovie,
} = require("../controllers/movie.controller");

router.get("/", getMovie);
router.post("/addMovie", addMovie);

module.exports = router;