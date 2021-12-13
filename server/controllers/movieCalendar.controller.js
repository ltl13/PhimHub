const argon2 = require('argon2');
const MovieCalendar = require('../models/MovieCalendar');

const SeatType = require('../models/SeatType');
const Room = require('../models/Room');
const Seat = require('../models/Seat');
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
        select: 'name',
      })
      .populate({
        path: 'movie',
        select: 'name',
      });
    return res.status(200).json({
      success: true,
      allMovieCalendars,
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
        select: 'name',
      })
      .populate({
        path: 'movie',
        select: 'name',
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

const createMovieCalendar = async (req, res) => {
  try {
    const { dateTimeStart, room, movie } = req.body;

    const seats = [];

    const roomInfo = await Room.findById(room).populate({
      path: 'roomType',
      select: 'seats',
    });

    const emptySeatType = await SeatType.findOne({ typeName: '#' });
    const roomInfoRowLength = roomInfo.roomType.seats.length;
    const { rowPreview, columnPreview } = createRowColumnPreview(
      roomInfo.roomType.seats,
      emptySeatType._id
    );

    if (roomInfoRowLength > 0) {
      for (let i = 0; i < roomInfoRowLength; i++) {
        const rowLength = roomInfo.roomType.seats[i];
        const tempRow = [];

        if (rowLength > 0) {
          for (let j = 0; j < rowLength; j++) {
            if (emptySeatType._id === roomInfo.roomType.seats[i][j]) {
              tempRow.push(null);
            } else {
              const newSeat = new Seat({});
            }
          }
        }
      }
    }

    console.log(roomInfo.roomType.seats);

    // const newMovieCalendar = new MovieCalendar({
    //   dateTimeStart,
    //   seats,
    //   room,
    //   movie,
    // });
    // await newMovieCalendar.save();

    return res.status(201).json({
      success: true,
      message: 'New movie calendar was created successfully',
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
    const { dateTimeStart, price, room, movie } = req.body;

    const movieCalendar = await MovieCalendar.findOne({ _id: req.params.id });
    if (!movieCalendar) {
      return res.status(406).json({
        success: false,
        message: 'Movie calendar not found',
      });
    }

    await MovieCalendar.findOneAndUpdate(
      { _id: req.params.id },
      {
        dateTimeStart: new Date(dateTimeStart.concat('T00:00:10Z')),
        price,
        room,
        movie,
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
