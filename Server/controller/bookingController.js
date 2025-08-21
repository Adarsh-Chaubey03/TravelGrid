const Booking = require("../models/booking");
const User = require("../models/user");

exports.addBooking = async (req, res) => {
    try {

        const { userId } = req.user;

        const { startingDate, endingDate, noOfRooms, noOfPeople, status, destination } = req.body

        // check if the startingdate, ending date and noOfRooms is required

        if (!startingDate || !endingDate || !noOfRooms || !noOfPeople || !destination) {
            throw new Error("All fields are required!")
        }

        if (!userId) {
            return res
                .status(400)
                .json({
                    message: "User not authenticated",
                    success: false
                })
        }

        // if userid is present

        // checking if booking is already present for the user

        const isBookingAvailable = await Booking.findOne({ userId, destination })

        if (!isBookingAvailable) {
            return res
                .status(400)
                .json({
                    message: 'Booking of the destination is already present for the user',
                    success: false
                })
        }

        // if the booking is not available for the user

        const newBooking = new Booking({
            userId: userId,
            startingDate: startingDate,
            endingDate: endingDate,
            noOfRooms: noOfRooms,
            noOfPeople: noOfPeople,
            destination: destination,
            status: status || "Pending",
        })

        await newBooking.save()

        return res
            .status(200)
            .json({
                message: "Booking is done successfully!!",
                success: true,
                data: newBooking
            })

    }
    catch (error) {
        return res
            .status(500)
            .json({
                message: "Service issue in adding booking",
                success: false
            })
    }
}

exports.getAllBooking = async (req, res) => {
    try {

        // check of if user is present for protected route
        const { userId } = req.user

        // if userid is not present that means the user is not authenticated
        if (!userId) {
            return res
                .status(400)
                .json({
                    message: 'User is not authenticated',
                    success: false
                })
        }

        // if user is present then fetch the bookings of the user in sorted manner w.r.t to the starting date
        const userBookings = await Booking.find({ userId }).sort({ startingDate: 1 })

        if (!userBookings) {
            return res
                .status(400)
                .json({
                    message: "No booking available for the user",
                    success: false
                })
        }

        return res
            .status(200)
            .json({
                message: "All bookings are fetched!",
                success: true,
                data: userBookings
            })

    }
    catch (error) {
        return res
            .status(500)
            .json({
                message: "Unable to fetch all the bookings from user",
                success: false
            })
    }
}

exports.getBooking = async (req, res) => {
    try {
        const { bookingId } = req.params
        const { userId } = req.user

        // check if user is authorised
        if (!userId) {
            return res
                .status(400)
                .json({
                    message: "User is not authorised",
                    success: false
                })
        }

        // checking if booking id is provided or not
        if (!bookingId) {
            return res
                .status(400)
                .json({
                    message: "Booking id is not provided",
                    success: false
                })
        }

        const fetchedBooking = await Booking.findById(bookingId);

        if (!fetchedBooking) {
            return res
                .status(400)
                .json({
                    message: 'Booking is unavailable'
                })
        }

        return res
            .status(200)
            .json({
                message: "Desired booking fetched successfully!",
                data: fetchedBooking,
                success: true
            })

    }
    catch (error) {
        return res
            .status(500)
            .json({
                message: "Unable to fetch the desired booking",
                success: false
            })
    }
}

/* LEFT AND REMAINIG TO CHECK */
exports.editBooking = async (req, res) => {
    try {

        const { bookingId } = req.params

        const { userId } = req.user

        if (!userId) {
            return res
                .status(400)
                .json({
                    message: "Unauthorized access",
                    success: false
                })
        }

        // check if booking id is present
        if (!bookingId) {
            return res
                .status(400)
                .json({
                    message: "Booking id is required",
                    success: false
                })
        }

        // now edit
        const allowedField = ["startingDate", "endingDate", "noOfRooms", "noOfPeople", "status", "destination"]

        // store the fields to be uupdated
        const updateFields = {};

        for (let field of allowedField) {
            if (req.body[field] != undefined) {
                updateFields[field] = req.body[field]
            }
        }

        // now checking if any update available
        if (Object.keys(updateFields).length == 0) {
            return res
                .status(400)
                .json({
                    message: "No valid field provided for update",
                    success: false
                })
        }

        // update the fields now
        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: bookingId, userId },
            updateFields,
            { new: true }
        )

        if (!updatedBooking) {
            return res
                .status(400)
                .json({
                    message: "Booking is not found or doesnot belong to the user",
                    success: false
                })
        }

        // updated successfully!
        return res
            .status(200)
            .json({
                message: "Booking updated successfully!!",
                success: true,
                data: updatedBooking
            })
    }
    catch (error) {
        return res
            .status(500)
            .json({
                message: "Error editing booking",
                success: false
            })
    }

}

exports.deleteBooking = async (req, res) => {
    try {
        // get the userid
        const userId = req.user

        if (!userId) {
            return res
                .status(400)
                .json({
                    message: "User is not authorized",
                    success: false
                })
        }

        // get the booking id
        const { bookingId } = req.params

        if (!bookingId) {
            return res
                .status(400)
                .json({
                    message: "Booking id is not available",
                    success: false
                })
        }

        const booking = await Booking.findById(bookingId)

        if (!booking) {
            return res
                .status(400)
                .json({
                    message: "Booking not found",
                    success: false
                });
        }

        if (booking.userId.toString() != userId) {
            return res
                .status(400)
                .json({
                    message: "Unauthorized to delete this booking",
                    success: false
                })
        }

        await booking.deleteOne()

        return res
            .status(200)
            .json({
                message: "Booking deleted successfully!!",
                success: true,
            })
    }
    catch (error) {
        return res
            .status(500)
            .json({
                message: "Error deleting the message",
                success: false
            })
    }
}

exports.rebookBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { userId } = req.user;

        if (!userId) {
            return res.status(400).json({
                message: "User is not authorized",
                success: false
            });
        }

        if (!bookingId) {
            return res.status(400).json({
                message: "Booking ID is required",
                success: false
            });
        }

        const originalBooking = await Booking.findById(bookingId);

        if (!originalBooking || originalBooking.userId.toString() !== userId) {
            return res.status(400).json({
                message: "Booking not found or does not belong to the user",
                success: false
            });
        }

        const newBooking = new Booking({
            userId: userId,
            startingDate: originalBooking.startingDate,
            endingDate: originalBooking.endingDate,
            noOfRooms: originalBooking.noOfRooms,
            noOfPeople: originalBooking.noOfPeople,
            destination: originalBooking.destination,
            status: "Pending"
        });

        await newBooking.save();

        return res.status(200).json({
            message: "Rebooking successful! Please verify details and complete the payment.",
            success: true,
            data: newBooking
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error rebooking the trip",
            success: false
        });
    }
}