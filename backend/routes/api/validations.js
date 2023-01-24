const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
    check('credential').exists({ checkFalsy: true }).notEmpty().withMessage('Email or username is required'),
    check('password').exists({ checkFalsy: true }).withMessage('Password is required.'),
    handleValidationErrors
];

const validateSignUp = [
    check('username').exists({ checkFalsy: true }).withMessage('Username is required'),
    check('username').isLength({ min:4 }).withMessage('Username must be atleast 4 characters'),
    check('username').not().isEmail().withMessage('Username cannot be an email'),
    check('email').exists({ checkFalsy: true }).isEmail().withMessage('Invalid email'),
    check('firstName').exists({ checkFalsy: true }).withMessage('First name is required'),
    check('firstName').isLength({ min: 4 }).withMessage('First name must be 4 or more characters'),
    check('firstName').not().isEmail().withMessage('First name cannot be an email'),
    check('lastName').exists({ checkFalsy: true }).withMessage('Last name is required'),
    check('lastName').isLength({ min: 4 }).withMessage('Last name must be 4 or more characters'),
    check('lastName').not().isEmail().withMessage('Last name cannot be an email'),
    check('password').exists({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
]

const validateCreateSpot = [
    check('address').exists({ checkFalsy: true }).withMessage('Street address is required'),
    check('city').exists({ checkFalsy: true }).withMessage('City is required'),
    check('state').exists({ checkFalsy: true }).withMessage('State is required'),
    check('country').exists({ checkFalsy: true }).withMessage('Country is required'),
    check('lat').exists({ checkFalsy: true }).withMessage('Latitude is not valid'),
    check('lng').exists({ checkFalsy: true }).withMessage('Longitude is not valid'),
    check('name').isLength({ max:50 }).withMessage('Name must be less than 50 characters'),
    check('description').exists({ checkFalsy: true }).withMessage('Description is required'),
    check('price').exists({ checkFalsy: true }).withMessage('Price per day is required'),
    handleValidationErrors
]

const validateSpotImage = [
    check('url').exists({ checkFalsy: true }).withMessage('Image URL is required'),
    handleValidationErrors
]

const validateReview = [
    check('review').exists({ checkFalsy: true }).isLength({ min:20, max: 500 }).withMessage('Review text is required'),
    check('stars').isInt({gt: 0, lt: 6}).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]
  
module.exports = {
    validateSignUp,
    validateCreateSpot,
    validateLogin,
    validateSpotImage,
    validateReview
}
