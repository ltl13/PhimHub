const express = require("express");
const router = express.Router();

const {
    getAllMovieTypes,
    createMovieType,
    getMovieTypeById,
    updateMovieTypeById,
    deleteMovieTypeById,
} = require("../controllers/movieType.controller");


router.get("/get-all", getAllMovieTypes);
router.get("/get/:id", getMovieTypeById);
router.post("/create", createMovieType);
router.put("/update/:id", updateMovieTypeById);
router.delete("/delete/:id", deleteMovieTypeById);

module.exports = router;