const express = require("express");
const router = express.Router();

const {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovieById,
    deleteMovieById
} = require("../controllers/movie.controller");

router.get("/get-all", getAllMovies);
router.get("/get/:id", getMovieById);
router.post("/create", createMovie);
router.put("/update/:id", updateMovieById);
router.delete("/delete/:id", deleteMovieById);

module.exports = router;