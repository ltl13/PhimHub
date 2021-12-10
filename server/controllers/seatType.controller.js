const SeatType = require('../models/SeatType');
const Seat = require('../models/Seat');
const { confirmAccess } = require('../shared/functions');

const getAllSeatTypes = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'CinemaRoomManagement',
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

  // Passed
  try {
    const allSeatTypes = await SeatType.find();
    return res.status(200).json({
      success: true,
      allSeatTypes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getSeatTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'CinemaRoomManagement',
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

  // Passed
  try {
    const seatType = await SeatType.findById(req.params.id);
    if (!seatType)
      return res.status(406).json({
        success: false,
        message: 'Seat type not found',
      });
    return res.status(200).json({
      success: true,
      seatType,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const createSeatType = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'CinemaRoomManagement',
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

  // Passed
  try {
    const { typeName, size } = req.body;

    // Check if this type has existed
    let checker = await SeatType.findOne({ typeName });
    if (checker)
      return res.status(409).json({
        success: false,
        message: 'This type has existed',
      });

    // Add new type
    const newSeatType = new SeatType({
      typeName,
      size,
    });
    await newSeatType.save();
    return res.status(201).json({
      success: true,
      message: 'New seat type has just been added',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateSeatTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'CinemaRoomManagement',
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

  try {
    const { typeName, size } = req.body;

    // Check if Seat exists in database
    const seatType = await SeatType.findById(req.params.id);
    if (!seatType) {
      return res.status(406).json({
        success: false,
        message: 'Seat type not found',
      });
    }

    // Check if new type name has existed
    const checker = await SeatType.findOne({
      typeName,
    });
    if (checker && seatType.typeName != typeName) {
      return res.status(400).json({
        success: false,
        message: 'This seat type has existed',
      });
    }

    // Update new type name
    await SeatType.findByIdAndUpdate(
      req.params.id,
      {
        typeName,
        size,
      },
      { new: true }
    ).then(async (result) => await result.save());

    // Updated successfully
    return res.status(200).json({
      success: true,
      message: 'Seat type has been updated',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const deleteSeatTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'CinemaRoomManagement',
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

  // Passed
  try {
    // Check if there are still Seats of this type
    const seatChecker = await Seat.findOne({
      seatType: req.params.id,
      status: { $ne: 0 },
    });
    if (seatChecker) {
      return res.status(406).json({
        success: false,
        message: 'Can not delete because there are still seats of this type',
      });
    }

    // Delete Seat type
    const deleteSeatType = await SeatType.findByIdAndDelete(req.params.id);
    if (!deleteSeatType) {
      return res.status(406).json({
        success: false,
        message: 'Seat type not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Delete seat type successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getInfoSeatType = async (seats) => {
  const newSeats = [];
  if (seats.length > 0) {
    for (let i = 0; i < seats.length; i++) {
      const newRows = [];

      if (seats[i].length > 0) {
        for (let j = 0; j < seats[i].length; j++) {
          const temp = await SeatType.findById(seats[i][j]);
          newRows.push(temp);
        }
      }

      newSeats.push(newRows);
    }
  }

  return newSeats;
};

module.exports = {
  getAllSeatTypes,
  getSeatTypeById,
  createSeatType,
  updateSeatTypeById,
  deleteSeatTypeById,
  getInfoSeatType,
};
