const SpecialOffer = require("../models/SpecialOffer");
const Payment = require("../models/Payment");
const Ticket = require("../models/Ticket");
const { createTicket } = require("./ticket.controller");
const { confirmAccess } = require("../shared/functions");

const getAllPayments = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: "getAllPayments",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const allPayments = await Payment.find()
      .populate({
        path: "specialOffer",
        select: "value",
      })
      .populate({
        path: "staff",
        select: "name",
      });

    return res.status(200).json({
      success: true,
      allPayments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPaymentById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: "getPaymentById",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: "specialOffer",
        select: "value",
      })
      .populate({
        path: "staff",
        select: "name",
      });

    if (!payment)
      return res.status(406).json({
        success: false,
        message: "Payment not found",
      });
    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createPayment = async (req, res) => {
  // Passed
  try {
    const {
      specialOffer,
      staff,
      value,
      price,
      movieCalendar,
      movie,
      ticketType,
      seats,
      customer,
    } = req.body;

    // Check if special offer is valid
    const applySpecialOffer = await SpecialOffer.findOne({
      code: specialOffer,
      status: true,
    });
    if (!applySpecialOffer && specialOffer != null)
      return res.status(406).json({
        success: false,
        invalid: "specialOffer",
        message: "Invalid special offer code",
      });

    // Create new payment
    const newPayment =
      specialOffer != null
        ? new Payment({
            specialOffer: applySpecialOffer,
            staff,
            value,
          })
        : new Payment({
            staff,
            value,
          });

    // Create new ticket
    const newTicket = await createTicket({
      payment: newPayment._id,
      price,
      movieCalendar,
      movie,
      ticketType,
      seats,
      customer,
    });
    if (!newTicket.success)
      return res.status(406).json({
        success: false,
        invalid: "ticket",
        message: "Can not create new ticket, please check the input",
      });
    newPayment.ticket = newTicket.ticket._id;
    await newPayment.save();

    return res.status(201).json({
      success: true,
      message: "New payment was created successfully",
      payment: newPayment,
      ticket: newTicket.ticket,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refundPaymentByTicketId = async (req, res) => {
  try {
    // Check if the ticket exists
    const ticket = Ticket.findOne({ _id: req.params.id, status: true });
    if (!ticket)
      return res.status(406).json({
        success: false,
        message: "Ticket not found",
      });

    // Get payment's information
    const payment = await Payment.findOne({ ticket: ticket._id });

    // If ticket is found, start to make a refund
    const refund = new Payment({
      ticket: payment.ticket,
      value: -payment.value * 0.7,
    });
    refund.save();

    // Update ticket's status to false
    await Ticket.findOneAndUpdate(
      { _id: ticket._id, status: true },
      { status: false },
      { new: true }
    ).then((result) => result.save());

    // Update special offer's status to true, means that it haven't been used
    await SpecialOffer.findOne(
      { _id: ticket.specialOffer, status: false },
      { status: true },
      { new: true }
    ).then((result) => result.save());

    return res.status(201).json({
      success: true,
      message: "Refund was made successfully",
      refund,
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
  getAllPayments,
  getPaymentById,
  createPayment,
  refundPaymentByTicketId,
};
