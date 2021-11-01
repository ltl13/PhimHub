const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const {
  createSpecialOfferType,
  getSpecialOfferTypeById,
  updateSpecialOfferTypeById,
  getAllSpecialOfferTypes,
  deleteSpecialOfferTypeById,
} = require("../controllers/specialOfferType.controller");

router.post("/create", verifyToken, createSpecialOfferType);
router.get("/get-all", verifyToken, getAllSpecialOfferTypes);
router.get("/get/:id", verifyToken, getSpecialOfferTypeById);
router.put("/update/:id", verifyToken, updateSpecialOfferTypeById);
router.delete("/delete/:id", verifyToken, deleteSpecialOfferTypeById);

module.exports = router;
