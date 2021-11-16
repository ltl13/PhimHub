const SpecialOffer = require("../models/SpecialOffer");
const { confirmAccess } = require("../shared/functions");

const getAllSpecialOffers = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "getAllSpecialOffers",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const allSpecialOffers = await SpecialOffer.find();
    return res.status(200).json({
      success: true,
      allSpecialOffers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSpecialOfferById = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "getSpecialOfferById",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const specialOffer = await SpecialOffer.findById(req.params.id);
    if (!specialOffer)
      return res.status(404).json({
        success: false,
        message: "Special offer not found",
      });
    return res.status(200).json({
      success: true,
      specialOffer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createSpecialOffer = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "createSpecialOffer",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const { code, expire, value, type } = req.body;

    // Check if code has already existed
    let checker = await SpecialOffer.findOne({ code, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        message: "This code has already existed",
      });
    }

    // Create new special offer
    const newSpecialOffer = new SpecialOffer({
      code,
      expire: new Date(expire),
      value,
      type,
    });
    newSpecialOffer.save();

    return res.status(201).json({
      success: true,
      message: "New special offer was created successfully",
      newSpecialOffer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateSpecialOfferById = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "updateSpecialOfferById",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const { code, expire, value, type } = req.body;

    // Check if this special offer exists
    const oldSpecialOffer = await SpecialOffer.findOne(req.params.id);
    if (!oldSpecialOffer)
      return res.status(404).json({
        success: false,
        message: "Special offer not found",
      });

    // Check if code has already existed
    let checker = await SpecialOffer.findOne({ code, status: true });
    if (checker && code != oldSpecialOffer.code) {
      return res.status(409).json({
        success: false,
        message: "This code has already existed",
      });
    }

    // Update special offer
    const updateSpecialOffer = await SpecialOffer.findByIdAndUpdate(
      req.params.id,
      {
        code,
        expire: new Date(expire),
        value,
        type,
      },
      { new: true }
    );
    await updateSpecialOffer.save();

    return res.status(201).json({
      success: true,
      message: "Special offer was updated successfully",
      updateSpecialOffer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteSpecialOfferById = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "deleteSpecialOfferById",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    // Check if this special offer exists
    let checker = await SpecialOffer.findById(req.params.id);
    if (!checker)
      return res.status(404).json({
        success: false,
        message: "Special offer not found",
      });

    // Delete special offer
    await SpecialOffer.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    ).then(async (result) => await result.save());

    return res.status(200).json({
      success: true,
      message: "Special offer was deleted successfully",
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
  getAllSpecialOffers,
  getSpecialOfferById,
  createSpecialOffer,
  updateSpecialOfferById,
  deleteSpecialOfferById,
};
