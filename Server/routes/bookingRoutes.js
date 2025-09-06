import express from 'express'
import { verifyJWT } from '../middleware/auth.js'

import bookingController from '../controller/bookingController.js'

const bookingRouter = express.Router()

// PROTECTED ROUTES
bookingRouter.post('/addBooking', verifyJWT, bookingController.addBooking)
bookingRouter.get('/getAllBookings',verifyJWT, bookingController.getAllBooking)
bookingRouter.get('/getBooking/:id', verifyJWT, bookingController.getBooking)
bookingRouter.delete('/deleteBooking/:id',verifyJWT, bookingController.deleteBooking)
bookingRouter.patch('/editBooking/:id',verifyJWT, bookingController.editBooking)

export default bookingRouter