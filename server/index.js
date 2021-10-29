require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/auth.route");
const customerTypeRoute = require("./routes/customerType.route");
const customerRoute = require("./routes/customer.route");
const roleRoute = require("./routes/role.route");
const staffTypeRoute = require("./routes/staffType.route");
const staffRoute = require("./routes/staff.route");

const app = express();
app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_CONNECTION_URI}`);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

connectDB();

app.use("/api/auth", authRoute);
app.use("/api/customer-type", customerTypeRoute);
app.use("/api/customer", customerRoute);
app.use("/api/role", roleRoute);
app.use("/api/staff-type", staffTypeRoute);
app.use("/api/staff", staffRoute);

// Lạy chúa, đừng thằng nào đụng vào những gì ở dưới, tao đang test thôi.
// Nhắc thằng Dàn luôn là ĐỪNG CODE TRÙNG FILE
const funcRoute = require("./routes/func.route");
app.use("/api/func", funcRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
