const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const dbConnection = require("./db");
const ObjectId = require("mongodb").ObjectId;
const Car = require("./models/carModel");
var cors = require('cors');
const path = require("path");

app.use(cors())
app.use(express.json({ extend: true }));

// Existing Routes
app.use("/api/cars/", require("./routes/carsRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/bookings/", require("./routes/bookingsRoute"));

// Revolutionary New Routes
app.use("/api/recommendations", require("./routes/recommendationsRoute"));
app.use("/api/loyalty", require("./routes/loyaltyRoute"));
app.use("/api/trip-plan", require("./routes/tripPlanRoute"));
app.use("/api/social-booking", require("./routes/socialBookingRoute"));
app.use("/api/car-health", require("./routes/carHealthRoute"));
app.use("/api/support", require("./routes/supportRoute"));

app.get("/api/cars/getallcars",async (req, res) => {
    const carsData = await Car.find();
  res.json(carsData);
});

// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
}


app.listen(port, () => console.log(`Node JS Server Started in Port ${port}`));
