const argon2 = require("argon2");

const Account = require("../models/Account");
const Staff = require("../models/Staff");
const { confirmAccess } = require("../shared/functions");

const getAllStaffs = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "getAllStaffs",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const allStaffs = await Staff.find({ status: true })
      .populate({
        path: "staffType",
        select: "typeName",
      })
      .select("-password");
    return res.status(200).json({
      success: true,
      allStaffs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStaffById = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "getStaffById",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const staff = await Staff.findById(req.params.id)
      .populate({
        path: "staffType",
        select: "typeName",
      })
      .select("-password");
    if (!staff)
      return res.status(406).json({
        success: false,
        message: "Staff not found",
      });
    return res.status(200).json({
      success: true,
      staff,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createStaff = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "createStaff",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const {
      staffType,
      username,
      password,
      phoneNumber,
      email,
      name,
      sex,
      dateOfBirth,
      identityNumber,
      salary,
    } = req.body;

    // Check if email/phone number/identity number has been used by another staff before
    let checker = await Staff.findOne({ phoneNumber, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: "phoneNumber",
        message: "This phone number has been used by another staff",
      });
    }

    checker = await Staff.findOne({ identityNumber, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: "identityNumber",
        message: "This identity number has been used by another staff",
      });
    }

    checker = await Staff.findOne({ email, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: "email",
        message: "This email has been used by another staff",
      });
    }

    // Create new staff
    const hashedPassword = await argon2.hash(password);
    const newStaff = new Staff({
      staffType,
      phoneNumber,
      username,
      password: hashedPassword,
      email,
      name,
      sex,
      dateOfBirth: new Date(dateOfBirth.concat("T00:00:20Z")),
      identityNumber,
      salary,
    });
    await newStaff.save();

    return res.status(201).json({
      success: true,
      message: "New staff was created successfully",
      newStaff,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const loginStaff = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Check for existing account
    const staff = await Staff.findOne({ phoneNumber, status: true });
    if (!staff) {
      return res.status(406).json({
        success: false,
        invalid: "phoneNumber",
        message: "Incorrect phone number",
      });
    }

    // Check for correct password
    const correctPassword = await argon2.verify(customer.password, password);
    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        invalid: "password",
        message: "Incorrect password",
      });
    }

    // Login
    const accessToken = jsonwebtoken.sign(
      { id: staff._id, staffType: staff.staffType },
      process.env.ACCESS_TOKEN_SECRET
    );
    await Staff.findByIdAndUpdate(
      staff._id,
      { token: accessToken },
      { new: true }
    ).then(async (result) => await result.save());

    res.status(201).json({
      success: true,
      message: "User logged in",
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const resetPasswordStaff = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await Staff.findOne({ email, status: true });
    if (!user) {
      return res.status(406).json({
        success: false,
        message: "Email does not exist",
      });
    }

    // Send new password to user's email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "thanhluan130201@gmail.com",
        pass: "Luan130201",
      },
    });
    const newPassword = Math.random().toString(36).slice(-8);
    const content = {
      from: '"PhimHub" <phimhub@cinema.com>',
      to: email,
      subject: "Hello",
      text: "Reset your password",
      html: `<b>Hello, this is your new password: </b>${newPassword}`,
    };
    transporter.sendMail(content, async function (err, info) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          success: false,
          message: "There is an error occurred when sending email",
        });
      } else {
        // Change user's password in database
        const hashedPassword = await argon2.hash(newPassword);
        const updatePassword = await Staff.findOneAndUpdate(
          { email, status: true },
          { password: hashedPassword },
          { new: true }
        );
        await updatePassword.save();
        if (!updatePassword) {
          return res.status(400).json({
            success: false,
            message: "Update password failed due to no authorization",
          });
        }

        // Return status code
        return res.status(200).json({
          success: true,
          message: "Password reset email sent",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateStaffById = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "getAllCustomers",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const {
      staffType,
      phoneNumber,
      email,
      name,
      sex,
      dateOfBirth,
      identityNumber,
      salary,
    } = req.body;

    // Check if this staff exists
    const staff = await Staff.findOne({
      _id: req.params.id,
      status: true,
    });
    if (!staff)
      return res.status(406).json({
        status: false,
        message: "Staff not found",
      });

    // Check if email or phone number doesn't change
    // Check if the email/phone number/identify number has been used by another staff
    let checker = await Staff.findOne({ phoneNumber, status: true });
    if (checker && phoneNumber !== staff.phoneNumber) {
      return res.status(400).json({
        success: false,
        invalid: "phoneNumber",
        message: "This phone number has been used by another staff",
      });
    }
    checker = await Staff.findOne({ email, status: true });
    if (checker && email !== staff.email) {
      return res.status(400).json({
        success: false,
        invalid: "email",
        message: "This email has been used by another staff",
      });
    }
    checker = await Staff.findOne({ identityNumber, status: true });
    if (checker && identityNumber !== staff.identityNumber) {
      return res.status(400).json({
        success: false,
        invalid: "identityNumber",
        message: "This identity number has been used by another staff",
      });
    }

    // Update staff's information
    await Staff.findOneAndUpdate(
      { _id: req.params.id, status: true },
      {
        staffType,
        phoneNumber,
        email,
        name,
        sex,
        identityNumber,
        salary,
        dateOfBirth: new Date(dateOfBirth.concat("T00:00:10Z")),
      },
      { new: true }
    ).then((result) => result.save());
    return res.status(200).json({
      success: true,
      message: "Staff's information has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteStaffById = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "getAllCustomers",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    // Delete customer
    const deleteStaff = await Staff.findOneAndUpdate(
      { _id: req.params.id, status: true },
      { status: false },
      { new: true }
    );
    if (!deleteStaff) {
      return res.status(406).json({
        success: false,
        message: "Staff not found",
      });
    }

    // Delete account goes with that customer
    let checker = await Account.findByIdAndDelete(deleteStaff.account);
    if (!checker) {
      return res.status(406).json({
        success: false,
        message:
          "Found the staff but not found the account, maybe this staff was deleted",
      });
    }
    deleteStaff.save();

    return res.status(200).json({
      success: true,
      message: "Delete staff successfully",
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
  getAllStaffs,
  getStaffById,
  loginStaff,
  resetPasswordStaff,
  createStaff,
  updateStaffById,
  deleteStaffById,
};
