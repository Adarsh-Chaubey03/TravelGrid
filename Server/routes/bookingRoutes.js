import express from 'express'
import {verifyJWT} from '../middleware/auth.js'
import { addBooking, deleteBooking, editBooking, getAllBooking, getBooking, rebookBooking } from '../controller/bookingController.js'
const bookingRouter = express.Router()

// PROTECTED ROUTES
bookingRouter.post('/addBooking', verifyJWT, addBooking)
bookingRouter.get('/getAllBookings', verifyJWT, getAllBooking)
bookingRouter.get('/getBooking/:id', verifyJWT, getBooking)
bookingRouter.delete('/deleteBooking/:id', verifyJWT, deleteBooking)
bookingRouter.patch('/editBooking/:id', verifyJWT, editBooking)
bookingRouter.post('/rebook/:id', verifyJWT, rebookBooking)

export default bookingRouter