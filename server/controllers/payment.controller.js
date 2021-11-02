const Payment = require("../models/Payment");
const SpecialOffer = require("../models/SpecialOffer");
const { createTicket } = require("./ticket.controller");
const { confirmAccess } = require("../shared/functions");

const getAllPayments = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
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
    role: req.body.role,
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
      return res.status(404).json({
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

const makePayment = async (req, res) => {
  // Passed
  try {
    const {
      specialOffer,
      staff,
      value,
      price,
      dateTimeStart,
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
    if (!applySpecialOffer)
      return res.status(406).json({
        success: false,
        invalid: "specialOffer",
        message: "Invalid special offer code",
      });

    // Create new payment
    const newPayment = new Payment({
      specialOffer: applySpecialOffer,
      staff,
      value,
    });

    // Create new ticket
    const newTicket = await createTicket({
      payment: newPayment._id,
      price,
      dateTimeStart,
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

const updatePaymentById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "updatePaymentById",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deletePaymentById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "deletePaymentById",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
