const express = require("express");
const router = express.Router();

const {
  getStatisticByMonthsInYear,
  getStatisticByYears,
  getStatisticByQuartersInYear,
  getStatisticByMoviesInMonth,
  getStatisticByMoviesInDate,
} = require("../controllers/statistic.controller");

router.get("/by-months-in-year", getStatisticByMonthsInYear);
router.get("/by-years", getStatisticByYears);
router.get("/by-quarters-in-year", getStatisticByQuartersInYear);
router.get("/by-movies-in-month", getStatisticByMoviesInMonth);
router.get("/by-movies-in-date", getStatisticByMoviesInDate);

module.exports = router;
