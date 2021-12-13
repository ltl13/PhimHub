const express = require("express");
const router = express.Router();

const {
  getStatisticByMonthsInYear,
  getStatisticByYears,
  getStatisticByQuartersInYear,
  getStatisticByMoviesInMonth,
  getStatisticByMoviesInDate,
} = require("../controllers/statistic.controller");

router.post("/by-months-in-year", getStatisticByMonthsInYear);
router.post("/by-years", getStatisticByYears);
router.post("/by-quarters-in-year", getStatisticByQuartersInYear);
router.post("/by-movies-in-month", getStatisticByMoviesInMonth);
router.post("/by-movies-in-date", getStatisticByMoviesInDate);

module.exports = router;
