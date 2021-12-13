const argon2 = require('argon2');
const jsonwebtoken = require('jsonwebtoken');

const Staff = require('../models/Staff');
const { confirmAccess, standardName } = require('../shared/functions');


const getAllStaffs = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'StaffManagement',
  });
  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

  // Passed
  try {
    const allStaffs = await Staff.find({ status: true })
      .populate({
        path: 'staffType',
        select: 'typeName',
      })
      .select('-password');
    return res.status(200).json({
      success: true,
      allStaffs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getStaffById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'StaffManagement',
  });
  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

  // Passed
  try {
    const staff = await Staff.findById(req.params.id)
      .populate({
        path: 'staffType',
        select: 'typeName',
      })
      .select('-password');
    if (!staff)
      return res.status(406).json({
        success: false,
        message: 'Staff not found',
      });
    return res.status(200).json({
      success: true,
      staff,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const createStaff = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'StaffManagement',
  });
  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

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
      avatar,
    } = req.body;

    // Check if email/phone number/identity number has been used by another staff before
    let checker = await Staff.findOne({ phoneNumber, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: 'phoneNumber',
        message: 'This phone number has been used by another staff',
      });
    }

    checker = await Staff.findOne({ identityNumber, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: 'identityNumber',
        message: 'This identity number has been used by another staff',
      });
    }

    checker = await Staff.findOne({ email, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: 'email',
        message: 'This email has been used by another staff',
      });
    }

    checker = await Staff.findOne({ username, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: 'username',
        message: 'This username has been used by another staff',
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
      name: standardName(name),
      sex,
      dateOfBirth: new Date(dateOfBirth),
      identityNumber,
      salary,
      avatar,
    });
    await newStaff.save();

    return res.status(201).json({
      success: true,
      message: 'New staff was created successfully',
      newStaff,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const loginStaff = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for existing account
    const staff = await Staff.findOne({ username, status: true });
    if (!staff) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect username or password',
      });
    }

    // Check for correct password
    const correctPassword = await argon2.verify(staff.password, password);
    if (!correctPassword) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect username or password',
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

    res.status(200).json({
      success: true,
      message: 'User logged in',
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const sendChangePasswordTokenStaff = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const staff = await Staff.findOne({ email, status: true });
    if (!staff) {
      return res.status(406).json({
        success: false,
        invalid: 'email',
        message: 'Email has not been registered yet',
      });
    }

    // Send new password to user's email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'thanhluan130201@gmail.com',
        pass: 'Luan130201',
      },
    });
    const changePasswordToken = Math.random().toString().slice(-6);
    const content = {
      from: '"PhimHub" <phimhub@cinema.com>',
      to: email,
      subject: 'Hello',
      text: 'Reset your password',
      html: `<b>Hello, this is your change password token, please do not share it to anyone. Please note that token will expire after 15 minutes: </b>${changePasswordToken}`,
    };
    const respondToken = jsonwebtoken.sign(
      { id: customer._id, token: changePasswordToken },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '900s' }
    );
    transporter.sendMail(content, async function (err, info) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          success: false,
          message: 'There is an error occurred when sending email',
        });
      } else {
        // Return status code
        return res.status(200).json({
          success: true,
          message: 'Change password token was sent to user',
          token: respondToken,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const resetPasswordStaff = async (req, res) => {
  try {
    const { token, id, inputToken, newPassword } = req.body;
    if (token != inputToken)
      return res.status(400).json({
        success: false,
        invalid: 'inputToken',
        message: 'Wrong token!!!',
      });

    // Change user's password in database
    const hashedPassword = await argon2.hash(newPassword);
    const updatePassword = await Staff.findOneAndUpdate(
      { _id: id, status: true },
      { password: hashedPassword },
      { new: true }
    );
    await updatePassword.save();
    if (!updatePassword) {
      return res.status(400).json({
        success: false,
        message: 'Update password failed due to no authorization',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Change password successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateStaffById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'StaffManagement',
  });
  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

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
      avatar,
      username,
      password,
    } = req.body;

    // Check if this staff exists
    const staff = await Staff.findOne({
      _id: req.params.id,
      status: true,
    });
    if (!staff)
      return res.status(406).json({
        status: false,
        message: 'Staff not found',
      });

    // Check if email or phone number doesn't change
    // Check if the email/phone number/identify number has been used by another staff
    let checker = await Staff.findOne({ phoneNumber, status: true });
    if (checker && phoneNumber !== staff.phoneNumber) {
      return res.status(400).json({
        success: false,
        invalid: 'phoneNumber',
        message: 'This phone number has been used by another staff',
      });
    }
    checker = await Staff.findOne({ email, status: true });
    if (checker && email !== staff.email) {
      return res.status(400).json({
        success: false,
        invalid: 'email',
        message: 'This email has been used by another staff',
      });
    }
    checker = await Staff.findOne({ identityNumber, status: true });
    if (checker && identityNumber !== staff.identityNumber) {
      return res.status(400).json({
        success: false,
        invalid: 'identityNumber',
        message: 'This identity number has been used by another staff',
      });
    }

    checker = await Staff.findOne({ username, status: true });
    if (checker && username !== staff.username) {
      return res.status(409).json({
        success: false,
        invalid: 'username',
        message: 'This username has been used by another staff',
      });
    }

    // Update staff's information
    const hashedPassword = await argon2.hash(password);
    await Staff.findOneAndUpdate(
      { _id: req.params.id, status: true },
      {
        staffType,
        phoneNumber,
        email,
        name: standardName(name),
        sex,
        identityNumber,
        salary,
        username,
        dateOfBirth: new Date(dateOfBirth),
        avatar: !!avatar ? avatar : staff.avatar,
        password: !!password ? hashedPassword : staff.password,
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
      message: 'Internal server error',
    });
  }
};

const deleteStaffById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'StaffManagement',
  });
  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

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
        message: 'Staff not found',
      });
    }
    deleteStaff.save();

    return res.status(200).json({
      success: true,
      message: 'Delete staff successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getLoggedInStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.body.id)
      .populate('staffType')
      .select('-password');
    if (!staff) {
      return res
        .status(400)
        .json({ success: false, message: 'Staff not found' });
    }
    return res.status(200).json({ success: true, staff });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const changePasswordStaff = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    let staff = await Staff.findOne({
      _id: id,
      status: true,
    });

    const correctPassword = await argon2.verify(staff.password, oldPassword);

    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password is not correct',
      });
    }

    // Change user's password in database
    const hashedPassword = await argon2.hash(newPassword);
    staff.password = hashedPassword;
    await staff.save();

    return res.status(201).json({
      success: true,
      message: 'Change password successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getAllStaffs,
  getStaffById,
  loginStaff,
  sendChangePasswordTokenStaff,
  resetPasswordStaff,
  createStaff,
  updateStaffById,
  deleteStaffById,
  getLoggedInStaff,
  changePasswordStaff,
};
