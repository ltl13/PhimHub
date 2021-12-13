const Payment = require("../models/Payment");
const Movie = require("../models/Movie");
const Ticket = require("../models/Ticket");
const { confirmAccess } = require("../shared/functions");

const getStatisticByMonthsInYear = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffTypeJwt,
  //   func: "StatisticManagement",
  // });
  // if (!confirm)
  //   return res.status(400).json({
  //     success: false,
  //     message: "Not has access",
  //   });

  try {
    const { year } = req.body;

    const allPayments = await Payment.find();
    if (!allPayments)
      return res.status(406).json({
        success: false,
        message: "Data not found",
      });

    let result = [];

    for (let month = 1; month <= 12; month++) {
      const _result = _calculateIncomeByMonth(allPayments, month, year);
      result.push({
        month,
        income: _result,
      });
    }

    if (result.length == 0)
      return res.status(406).json({
        success: false,
        message: "Data not found",
      });
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStatisticByQuartersInYear = async (req, res) => {
  try {
    const { year } = req.body;
    const allPayments = await Payment.find();
    if (!allPayments)
      return res.status(406).json({
        success: false,
        message: "Data not found",
      });

    let result = [];
    for (let quarter = 1; quarter <= 4; quarter++) {
      let _result = 0;
      for (let i = 0; i <= 2; i++) {
        const _month = (quarter - 1) * 3 + i;
        const income = _calculateIncomeByMonth(allPayments, _month, year);
        _result += income;
      }
      result.push({
        quarter,
        income: _result,
      });
    }

    if (result.length == 0)
      return res.status(406).json({
        success: false,
        message: "Data not found",
      });
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStatisticByYears = async (req, res) => {
  try {
    const { fromYear, toYear } = req.body;
    const allPayments = await Payment.find();
    if (!allPayments)
      return res.status(406).json({
        success: false,
        message: "Data not found",
      });

    let result = [];
    for (let year = fromYear; year <= toYear; year++) {
      const _result = _calculateIncomeByYear(allPayments, year);
      result.push({
        year,
        income: _result,
      });
    }

    if (result.length == 0)
      return res.status(406).json({
        success: false,
        message: "Data not found",
      });
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStatisticByMoviesInMonth = async (req, res) => {
  try {
    const { month, year } = req.body;
    const allPayments = await Payment.find();
    const result = await _calculateIncomeByMoviesInMonth(
      allPayments,
      month,
      year
    );

    if (result.lenth == 0)
      return res.status(406).json({
        success: false,
        message: "Data not found",
      });

    return res.status(200).json({
      success: true,
      result: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStatisticByMoviesInDate = async (req, res) => {
  try {
    const { date } = req.body;
    const _date = date.toISOString();
    const _year = _date[0];
    const _month = _date[1];
    const _day = _date[2].split("T")[0];
    const payments = await Payment.find();

    const result = await _calculateIncomeByMoviesInDate(
      payments,
      _day,
      _month,
      _year
    );

    if (result.lenth == 0)
      return res.status(406).json({
        success: false,
        message: "Data not found",
      });

    return res.status(200).json({
      success: true,
      result: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const _calculateIncomeByMonth = (payments, month, year) => {
  let income = 0;

  for (const payment of payments) {
    const _datetime = payment.paytime.toISOString().split("-");
    const _year = _datetime[0];
    const _month = _datetime[1];
    if (month == _month && _year == year) {
      income += payment.value;
    }
  }

  return income;
};

const _calculateIncomeByYear = (payments, year) => {
  let income = 0;
  for (const payment of payments) {
    const _year = payment.paytime.toISOString().split("-")[0];
    if (_year == year) {
      income += payment.value;
    }
  }
  return income;
};

const _calculateIncomeByMoviesInMonth = async (payments, month, year) => {
  try {
    let result = {};
    for (const payment of payments) {
      const _paytime = payment.paytime.toISOString();
      const _year = _paytime[0];
      const _month = _paytime[1];
      if (_year == year && _month == month) {
        const _ticket = await Ticket.findById(payment.ticket);
        const _movie = await Movie.findById(_ticket.movie);
        result[_movie.name] += payment.value;
      }
    }

    let finalResult = [];
    for (const key in result) {
      finalResult.push({
        movie: key,
        income: result[key],
      });
    }
    return finalResult;
  } catch (error) {
    return [];
  }
};

const _calculateIncomeByMoviesInDate = async (payments, day, month, year) => {
  try {
    let result = {};
    for (const payment of payments) {
      const _paytime = payment.paytime.toISOString();
      const _year = _paytime[0];
      const _month = _paytime[1];
      const _day = _paytime[2].split("T")[0];
      if (_year == year && _month == month && _day == day) {
        const _ticket = await Ticket.findById(payment.ticket);
        const _movie = await Movie.findById(_ticket.movie);
        result[_movie.name] += payment.value;
      }
    }

    let finalResult = [];
    for (const key in result) {
      finalResult.push({
        movie: key,
        income: result[key],
      });
    }
    return finalResult;
  } catch (error) {
    return [];
  }
};

module.exports = {
  getStatisticByMonthsInYear,
  getStatisticByYears,
  getStatisticByQuartersInYear,
  getStatisticByMoviesInMonth,
  getStatisticByMoviesInDate,
};
