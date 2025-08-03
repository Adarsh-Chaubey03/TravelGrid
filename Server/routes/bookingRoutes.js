const express = require('express')
const { verifyJWT } = require('../middleware/auth.js')

const bookingController = require('../controller/bookingController.js');

const bookingRouter = express.Router()

// PROTECTED ROUTES
bookingRouter.post('/addBooking', verifyJWT, bookingController.addBooking)
bookingRouter.get('/getAllBookings', verifyJWT, bookingController.getAllBooking)
bookingRouter.get('/getBooking/:bookingId', verifyJWT, bookingController.getBooking)
bookingRouter.delete('/deleteBooking/:bookingId', verifyJWT, bookingController.deleteBooking)
bookingRouter.patch('/editBooking/:bookingId', verifyJWT, bookingController.editBooking)

module.exports = bookingRouter