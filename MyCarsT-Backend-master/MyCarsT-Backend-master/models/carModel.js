const mongoose = require("mongoose");
const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    capacity: { type: String, required: false },
    fuelType: { type: String, required: false },
    currency: { type: String, required: false, default: "eur" },

    bookedTimeSlots: [
      {
        from: { type: String, required: true },
        to: {
          type: String,
          required: true,
        },
      },
    ],
    rentPerHour: { type: Number, required: true },
  },
  {
    timestamp: true,
  }
);
const carModel = mongoose.model("cars", carSchema);
module.exports = carModel;
