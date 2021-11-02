const SpecialOfferType = require("../models/SpecialOfferType");
const SpecialOffer = require("../models/SpecialOffer");

const getAllSpecialOfferTypes = async (req, res) => {
  try {
    const allSpecialOfferTypes = await SpecialOfferType.find();
    return res.status(200).json({
      success: true,
      allSpecialOfferTypes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSpecialOfferTypeById = async (req, res) => {
  try {
    const specialOfferType = await SpecialOfferType.findById(req.params.id);
    if (!specialOfferType) {
      return res.status(404).json({
        success: false,
        message: "Special offer type not found",
      });
    }
    return res.status(200).json({
      success: true,
      specialOfferType,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createSpecialOfferType = async (req, res) => {
  try {
    const { typeName } = req.body;

    // Check if this special offer type has existed in the database
    const specialOfferType = await specialOfferType.findOne({ typeName });
    if (specialOfferType) {
      return res.status(400).json({
        success: false,
        message: "This special offer type has existed",
      });
    }

    // Add new special offer type
    const newSpecialOfferType = new SpecialOfferType({
      typeName,
    });
    await newSpecialOfferType.save();
    return res.status(201).json({
      success: true,
      message: "New special offer type has just been added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateSpecialOfferTypeById = async (req, res) => {
  try {
    const { typeName } = req.body;

    // Check if special offer exists in database
    const specialOfferType = await SpecialOfferType.findById(req.params.id);
    if (!specialOfferType) {
      return res.status(404).json({
        success: false,
        message: "Special offer type not found",
      });
    }

    // Check if new type name has existed
    const checker = await SpecialOfferType.findOne({
      typeName,
    });
    if (checker && specialOfferType.typeName != typeName) {
      return res.status(400).json({
        success: false,
        message: "This special offer type has existed",
      });
    }

    // Update new type name
    await SpecialOfferType.findByIdAndUpdate(
      req.params.id,
      {
        typeName,
      },
      { new: true }
    ).then(async (result) => await result.save());

    // Updated successfully
    return res.status(200).json({
      success: true,
      message: "Special offer type has been updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteSpecialOfferTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "deleteSpecialOfferTypeById",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    // Check if there are still special offers of this type
    const specialOfferChecker = await SpecialOffer.findOne({
      specialOfferType: req.params.id,
      status: true,
    });
    if (specialOfferChecker) {
      return res.status(406).json({
        success: false,
        message:
          "Can not delete because there are still special offers of this type",
      });
    }

    // Delete SpecialOffer type
    const deleteSpecialOfferType = await SpecialOfferType.findByIdAndDelete(
      req.params.id
    );
    if (!deleteSpecialOfferType) {
      return res.status(404).json({
        success: false,
        message: "Special offer type not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Delete Special offer type successfully",
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
  createSpecialOfferType,
  getSpecialOfferTypeById,
  getAllSpecialOfferTypes,
  updateSpecialOfferTypeById,
  deleteSpecialOfferTypeById,
};
