const express = require("express");
const router = express.Router();

const {
  getReportByMonthsInYear,
  getReportByYears,
  getReportByQuartersInYear,
  getReportByMoviesInMonth,
} = require("../controllers/report.controller");

router.get("/by-months-in-year", getReportByMonthsInYear);
router.get("/by-years", getReportByYears);
router.get("/by-quarters-in-year", getReportByQuartersInYear);
router.get("/by-quarters-in-year", getReportByQuartersInYear);
router.get("/by-movies-in-month", getReportByMoviesInMonth);

module.exports = router;
