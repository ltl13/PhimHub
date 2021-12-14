const argon2 = require('argon2');
const MovieCalendar = require('../models/MovieCalendar');

const SeatType = require('../models/SeatType');
const Room = require('../models/Room');
const Seat = require('../models/Seat');
const Movie = require('../models/Movie');

const {
  confirmAccess,
  createRowColumnPreview,
  numToAlphabet,
} = require('../shared/functions');

const getAllMovieCalendars = async (req, res) => {
  try {
    const allMovieCalendars = await MovieCalendar.find()
      .populate({
        path: 'room',
      })
      .populate({
        path: 'movie',
      });

    const filteredCalendars = allMovieCalendars.filter((item) => {
      const time = new Date(item.timeStart);
      const dateTime = new Date(item.dateStart).setHours(
        time.getHours(),
        time.getMinutes(),
        0,
        0
      );
      return (
        new Date(dateTime) > new Date() &&
        item.size !== item.purchasedTicket.length
      );
    });

    return res.status(200).json({
      success: true,
      allMovieCalendars: filteredCalendars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getMovieCalendarById = async (req, res) => {
  try {
    const movieCalendar = await MovieCalendar.findById(req.params.id)
      .populate({
        path: 'room',
      })
      .populate({
        path: 'movie',
      });
    if (!movieCalendar) {
      return res.status(406).json({
        success: false,
        message: 'Movie not found',
      });
    }
    return res.status(200).json({
      success: true,
      movieCalendar,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const checkTimeIsInValid = async (dateStart, timeStart, movie, room) => {
  const movieCalendarsInDateStart = await MovieCalendar.find({
    dateStart: dateStart,
    room: room,
  }).populate({
    path: 'movie',
    select: 'duration',
  });

  const movieInfo = await Movie.findById(movie);

  const reqTime = new Date(timeStart);

  const standardizedTime = (time, duration = 0) => {
    return new Date(
      new Date().setHours(time.getHours(), time.getMinutes(), 0, 0) +
        (duration + 10) * 60000
    );
  };

  const checkTimeIsInValid = movieCalendarsInDateStart.some((item) => {
    const reqStandardizedTimeStart = standardizedTime(reqTime, 0);

    const reqStandardizedTimeEnd = standardizedTime(
      reqTime,
      movieInfo.duration
    );
    const itemTime = new Date(item.timeStart);

    const itemStandardizedTimeStart = standardizedTime(itemTime, 0);

    const itemStandardizedTimeEnd = standardizedTime(
      itemTime,
      item.movie.duration
    );
    return !(
      reqStandardizedTimeStart - itemStandardizedTimeEnd > 0 ||
      itemStandardizedTimeStart - reqStandardizedTimeEnd > 0 ||
      (reqStandardizedTimeStart - itemStandardizedTimeStart > 0 &&
        itemStandardizedTimeEnd - reqStandardizedTimeEnd > 0)
    );
  });

  return checkTimeIsInValid;
};

const createMovieCalendar = async (req, res) => {
  try {
    const { dateStart, timeStart, room, movie, price } = req.body;

    const check = await checkTimeIsInValid(dateStart, timeStart, movie, room);

    if (check) {
      return res.status(400).json({
        success: false,
        invalid: 'time',
        message: 'Time is conflict',
      });
    }

    const roomInfo = await Room.findById(room).populate({ path: 'roomType' });
    const emptySeatType = await SeatType.findOne({ typeName: '#' });
    let size = 0;
    roomInfo.roomType.seats.forEach((item) => {
      item.forEach((item) => {
        if (item !== emptySeatType._id) size++;
      });
    });

    const newMovieCalendar = new MovieCalendar({
      dateStart,
      timeStart,
      room,
      movie,
      price,
      size,
      purchasedTicket: [],
    });
    await newMovieCalendar.save();

    return res.status(201).json({
      success: true,
      message: 'New movie calendar was created successfully',
      newMovieCalendar,
    });
  } catch (error) {
    console.log(error);
    return res.stauts(500).json({
      success: false,
      message: 'Internal servar error',
    });
  }
};

const updateMovieCalendarById = async (req, res) => {
  try {
    const { dateStart, timeStart, room, movie, price } = req.body;

    const movieCalendar = await MovieCalendar.findOne({ _id: req.params.id });
    if (!movieCalendar) {
      return res.status(406).json({
        success: false,
        message: 'Movie calendar not found',
      });
    }

    const check = await checkTimeIsInValid(dateStart, timeStart, movie);

    if (check) {
      return res.status(400).json({
        success: false,
        invalid: 'time',
        message: 'Time is conflict',
      });
    }

    if (movieCalendar._doc.purchasedTicket.length !== 0) {
      return res.status(400).json({
        success: false,
        invalid: 'hasCustomer',
        message: 'Time is conflict',
      });
    }

    const roomInfo = await Room.findById(room).populate({ path: 'roomType' });
    const emptySeatType = await SeatType.findOne({ typeName: '#' });
    let size = 0;
    roomInfo.roomType.seats.forEach((item) => {
      item.forEach((item) => {
        if (item !== emptySeatType._id) size++;
      });
    });

    await MovieCalendar.findOneAndUpdate(
      { _id: req.params.id },
      {
        dateStart,
        timeStart,
        price,
        room,
        movie,
        price,
        size,
      },
      { new: true }
    ).then((result) => result.save());
    return res.status(200).json({
      success: true,
      message: "Movie calendar's information has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const deleteMovieCalendarById = async (req, res) => {
  try {
    const Calendar = await MovieCalendar.findById(req.params.id);

    if (Calendar._doc.purchasedTicket.length !== 0) {
      return res.status(400).json({
        success: false,
        invalid: 'hasCustomer',
        message: 'Time is conflict',
      });
    }

    const delMovieCalendar = await MovieCalendar.findByIdAndDelete(
      req.params.id
    );
    if (!delMovieCalendar) {
      return res.status(406).json({
        success: false,
        message: 'Movie calendar not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Delete movie calendar successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getAllMovieCalendars,
  getMovieCalendarById,
  createMovieCalendar,
  updateMovieCalendarById,
  deleteMovieCalendarById,
};
