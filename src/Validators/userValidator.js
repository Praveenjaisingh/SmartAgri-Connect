const { body, validationResult } = require("express-validator");

exports.createUserValidator = [

    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .bail(),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Valid email required"),

    body("password")
        .notEmpty()
        .withMessage("Password required")
        .bail()
        .isLength({ min: 6 }, { max: 16 })
        .withMessage("Password must be at least 6 characters and not more than 15 characters"),

    body("confirmPassword")
        .notEmpty()
        .withMessage("confirmPassword required")
        .bail()
        .isLength({ min: 6 }, { max: 16 })
        .withMessage("confirmPassword must be at least 6 characters and not more than 15 characters")

];

exports.loginValidator = [

    body("email")
        .notEmpty()
        .withMessage("Email required")
        .bail()
        .isEmail()
        .withMessage("Valid email required"),

    body("password")
        .notEmpty()
        .withMessage("Password required")
        .bail()

];

exports.createContactValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .bail(),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Valid email required")
];

exports.createPaymentValidator = [

    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .bail(),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Valid email required"),
    body("cardNumber")
        .isLength({ min: 16, max: 16 })
        .withMessage("Card number must be exactly 16 digits.")
        .bail(),

    body("CVV")
        .isLength({ min: 3, max: 3 })
        .withMessage("CVV must be exactly 3 digits")
        .bail(),

];

exports.deleteValidator = [
    body("id")
        .notEmpty()
        .withMessage("Id is required")
        .bail(),
];

exports.validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            status: false,
            errors: errors.array().map(err => err.msg)
        });

    }

    next();

};