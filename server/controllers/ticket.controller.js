const Ticket = require("../models/Ticket");
const TicketType = require("../models/TicketType");
const { confirmAccess } = require("../shared/functions");

const getAllTickets = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllTickets",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const allTickets = await Ticket.find()
      .populate({
        path: "ticketType",
        select: "typeName",
      })
      .populate({
        path: "customer",
        select: "phoneNumber",
      })
      .populate({
        path: "payment",
        select: "paytime",
      })
      .select("-seats");
    return res.status(200).json({
      success: true,
      allTickets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTicketById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getTicketById",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: "ticketType",
        select: "typeName",
      })
      .populate({
        path: "customer",
        select: "phoneNumber",
      })
      .populate({
        path: "payment",
        select: "paytime",
      })
      .select("-seats");
    if (!ticket)
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    return res.status(200).json({
      success: true,
      allTickets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createTicket = async ({
  price,
  dateTimeStart,
  movie,
  ticketType,
  payment,
  seats,
  customer,
}) => {
  try {
    // Create a new ticket
    const newTicket = new Ticket({
      price,
      dateTimeStart: new Date(dateTimeStart),
      movie,
      ticketType,
      payment,
      seats,
      customer,
    });
    await newTicket.save();

    return {
      success: true,
      ticket: newTicket,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      ticket: null,
    };
  }
};

module.exports = { getAllTickets, getTicketById, createTicket };
