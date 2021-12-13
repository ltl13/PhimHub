const express = require("express");
const router = express.Router();

const {
  getStatisticByMonthsInYear,
  getStatisticByYears,
  getStatisticByQuartersInYear,
  getStatisticByMoviesInMonth,
} = require("../controllers/statistic.controller");

router.get("/by-months-in-year", getStatisticByMonthsInYear);
router.get("/by-years", getStatisticByYears);
router.get("/by-quarters-in-year", getStatisticByQuartersInYear);
router.get("/by-quarters-in-year", getStatisticByQuartersInYear);
router.get("/by-movies-in-month", getStatisticByMoviesInMonth);

module.exports = router;
