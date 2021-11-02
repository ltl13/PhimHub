const express = require("express");
const router = express.Router();

const {
  getRoleById,
  getAllRoles,
  createRole,
  updateRoleById,
  deleteRoleById,
} = require("../controllers/role.controller");

router.get("/get/:id", getRoleById);
router.get("/get-all", getAllRoles);
router.post("/create", createRole);

module.exports = router;
