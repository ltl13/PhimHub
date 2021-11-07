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
const seatTypeRoute = require("./routes/seatType.route");
const roomTypeRoute = require("./routes/roomType.route");
const ticketTypeRoute = require("./routes/ticketType.route");
const ticketRoute = require("./routes/ticket.route");

const movieTypeRoute = require("./routes/movieType.route");
const movieRoute = require("./routes/movie.route");
const roomRoute = require("./routes/room.route");
const movieCalendar = require("./routes/movieCalendar.route");


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
app.use("/api/seat-type", seatTypeRoute);
app.use("/api/room-type", roomTypeRoute);
app.use("/api/ticket-type", ticketTypeRoute);
app.use("/api/ticket", ticketRoute);

app.use("/api/movie-type", movieTypeRoute);
app.use("/api/movie", movieRoute);
app.use("/api/room", roomRoute);
app.use("/api/movie-calendar", movieCalendar);

// Lạy chúa, đừng thằng nào đụng vào những gì ở dưới, tao đang test thôi.
// Nhắc thằng Dàn luôn là ĐỪNG CODE TRÙNG FILE
const funcRoute = require("./routes/func.route");
app.use("/api/func", funcRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
