const Ticket = require("../models/Ticket");
const TicketType = require("../models/TicketType");
const { confirmAccess } = require("../shared/functions");

const getAllTicketsInTime = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllTickets",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const { fromDate, toDate } = req.body;
    let allTickets;

    if (!fromDate && !toDate) {
      allTickets = await Ticket.find();
    } else if (!fromDate && !toDate) {
      allTickets = await Ticket.find({
        dateTimeStart: { $gte: Date(fromDate), $lte: Date(toDate) },
      });
    } else if (!fromDate) {
      allTickets = await Ticket.find({
        dateTimeStart: { $gte: Date(fromDate) },
      });
    } else if (!toDate) {
      allTickets = await Ticket.find({
        dateTimeStart: { $lte: Date(toDate) },
      });
    }
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
