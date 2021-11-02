const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const {
  createSpecialOffer,
  getSpecialOfferById,
  updateSpecialOfferById,
  getAllSpecialOffers,
  deleteSpecialOfferById,
} = require("../controllers/specialOffer.controller");

router.post("/create", verifyToken, createSpecialOffer);
router.get("/get-all", verifyToken, getAllSpecialOffers);
router.get("/get/:id", verifyToken, getSpecialOfferById);
router.put("/update/:id", verifyToken, updateSpecialOfferById);
router.delete("/delete/:id", verifyToken, deleteSpecialOfferById);

module.exports = router;
