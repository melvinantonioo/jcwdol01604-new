import express from 'express';
import { loginUser, registerUser, UpdateProfilePicture } from '../controllers/auth.controller';
import { LoginValidation, RegisterValidation } from '../middlewares/validation/auth.validation';
import { verifyEmail } from '../controllers/verify.email';
import { forgotPassword, resetPassword } from '../controllers/forgot.password';
import { VerifyToken } from '../middlewares/log.niddleware';
import { SingleUploader } from '../utils/uploader';

const router = express.Router();

router.post('/login', LoginValidation, loginUser);
router.post('/regis', RegisterValidation, registerUser);
router.get('/verify-email', verifyEmail);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.patch(
    "/avatar",
    VerifyToken,
    SingleUploader("AVT", "/avatar"),
    UpdateProfilePicture
);

export default router;