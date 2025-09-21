import { changePassword, resetPasswordToken } from '../controller/forgotPasswordController.js'
import express from 'express'

const router = express.Router()

router.post('/reset-password-token',resetPasswordToken)
router.post('/reset-password',changePassword)

export default router