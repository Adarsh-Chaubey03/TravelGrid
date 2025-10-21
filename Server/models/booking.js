import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    startingDate : {
        type : Date,
        required : [true,"Starting date is required"],
    },
    destination : {
        type : String,
        required : [true, "Destination is required"],
    },
    endingDate : {
        type : Date,
        required : [true, "Ending date is required"],
    },
    noOfRooms : {
        type : Number,
        required : [true, "Selecting number of rooms is required"],
    },
    noOfPeople :{
        type : Number,
        required : [true, "Please enter the number of people"],
    },
    status : {
        type: String,
        enum : ["Pending","Cancelled","Completed", "Confirmed"],
        default : "Pending",
    }

},{timestamps: true})

const Booking = mongoose.model("Booking",bookingSchema)

export { Booking };
export default Booking;