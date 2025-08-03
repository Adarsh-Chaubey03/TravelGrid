const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    hotelId: {
        type: String,
        ref: "Hotel",
        required: true,
    },
    name: String,
    email: String,
    phone: String,
    checkIn: Date,
    checkOut: Date,
    guests: Number, // alias for noOfPeople
    startingDate: Date,
    endingDate: Date,
    destination: {
        type: String,
        required: [true, "Destination is required"],
    },
    noOfRooms: {
        type: Number,
        required: [true, "Selecting number of rooms is required"],
    },
    status: {
        type: String,
        enum: ["Pending", "Cancelled", "Completed", "Confirmed"],
        default: "Pending",
    }
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);