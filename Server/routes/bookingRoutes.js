const express = require('express')
const { verifyJWT } = require('../middleware/auth.js')

const bookingController = require('../controller/bookingController.js')

const bookingRouter = express.Router()

// PROTECTED ROUTES
bookingRouter.post('/addBooking', verifyJWT, bookingController.addBooking)
bookingRouter.get('/getAllBookings', verifyJWT, bookingController.getAllBooking)
bookingRouter.get('/getBooking/:id', verifyJWT, bookingController.getBooking)
bookingRouter.delete('/deleteBooking/:id', verifyJWT, bookingController.deleteBooking)
bookingRouter.patch('/editBooking/:id', verifyJWT, bookingController.editBooking)
bookingRouter.post('/rebook/:id', verifyJWT, bookingController.rebookBooking)

module.exports = bookingRouter