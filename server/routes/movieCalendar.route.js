const express = require("express");
const router = express.Router();

const {
    getAllMovieCalendars,
    getMovieCalendarById,
    createMovieCalendar,
    updateMovieCalendarById,
    deleteMovieCalendarById
} = require("../controllers/movieCalendar.controller");

router.get("/get-all", getAllMovieCalendars);
router.get("/get/:id", getMovieCalendarById);
router.post("/create", createMovieCalendar);
router.put("/update/:id", updateMovieCalendarById);
router.delete("/delete/:id", deleteMovieCalendarById);

module.exports = router;