const TicketType = require("../models/TicketType");
const Ticket = require("../models/Ticket");
const { confirmAccess } = require("../shared/functions");

const getAllTicketTypes = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllTicketTypes",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const allTicketTypes = await TicketType.find();
    return res.status(200).json({
      success: true,
      allTicketTypes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTicketTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getTicketTypeById",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const ticketType = await TicketType.findById(req.params.id);
    if (!ticketType)
      return res.status(404).json({
        success: false,
        message: "Ticket type not found",
      });
    return res.status(200).json({
      success: true,
      ticketType,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createTicketType = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "createTicketType",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const { typeName } = req.body;

    // Check if this type has existed
    let checker = await TicketType.findOne({ typeName });
    if (checker)
      return res.status(409).json({
        success: false,
        message: "This type has existed",
      });

    // Add new type
    const newTicketType = new TicketType({
      typeName,
    });
    await newTicketType.save();
    return res.status(201).json({
      success: true,
      message: "New ticket type was added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateTicketTypeById = async (req, res) => {
  try {
    const { typeName } = req.body;

    // Check if ticket type exists in database
    const ticketType = await TicketType.findById(req.params.id);
    if (!ticketType) {
      return res.status(404).json({
        success: false,
        message: "Ticket type not found",
      });
    }

    // Check if new type name has existed
    const checker = await TicketType.findOne({
      typeName,
    });
    if (checker && ticketType.typeName != typeName) {
      return res.status(400).json({
        success: false,
        message: "This ticket type has existed",
      });
    }

    // Update new type name
    await TicketType.findByIdAndUpdate(
      req.params.id,
      {
        typeName,
      },
      { new: true }
    ).then(async (result) => await result.save());

    // Updated successfully
    return res.status(200).json({
      success: true,
      message: "Ticket type has been updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteTicketTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "deleteTicketTypeById",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    // Check if there are still Tickets of this type
    const ticketChecker = await Ticket.findOne({
      ticketType: req.params.id,
      dateTimeStart: { $gte: Date.now() },
    });
    if (ticketChecker) {
      return res.status(406).json({
        success: false,
        message: "Can not delete because there are still tickets of this type",
      });
    }

    // Delete Ticket type
    const deleteTicketType = await TicketType.findByIdAndDelete(req.params.id);
    if (!deleteTicketType) {
      return res.status(404).json({
        success: false,
        message: "Ticket type not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Delete ticket type successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllTicketTypes,
  getTicketTypeById,
  createTicketType,
  updateTicketTypeById,
  deleteTicketTypeById,
};
