import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

//tambah method sanitize
export const RegisterValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is Required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("name")
        .notEmpty()
        .withMessage("Name is Required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 character"),
    body("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 3 })
        .withMessage("Password must be at least have 3 character")
        .matches(/^(?=.*\d)(?=.*[!@#$%^&])[\w!@#$%^&]{6,16}$/)
        .withMessage("Password need to have at least 1 special character"),

    (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            console.log(errors);

            if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);

            next();
        } catch (error) {
            next(error);
        }
    }

];

export const LoginValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is Required")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 3 })
        .withMessage("Password must be at least have 3 character")
        .matches(/^(?=.*\d)(?=.*[!@#$%^&])[\w!@#$%^&]{6,16}$/)
        .withMessage("Password need to have at least 1 special character"),

    (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            console.log(errors);

            if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);

            next();
        } catch (error) {
            next(error);
        }
    }

];