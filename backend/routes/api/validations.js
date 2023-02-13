const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
    check('credential').exists({ checkFalsy: true }).notEmpty().withMessage('Email or username is required'),
    check('password').exists({ checkFalsy: true }).withMessage('Password is required.'),
    check('credential').isLength({ min: 4 }).withMessage('Username or email must be 4 or more characters'),
    check('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
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
    check('password').exists({ checkFalsy: true }).withMessage('Password is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be 6 characters or more.'),
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
    check('review').exists({ checkFalsy: true }).isLength({ min:1, max: 500 }).withMessage('Review text is required'),
    check('stars').isInt({gt: 0, lt: 6}).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

const validateReviewImage = [
    check('url').exists({ checkFalsy: true }).withMessage('Url is required'),
    handleValidationErrors
]

const validateBooking = [
    check('startDate').exists({ checkFalsy: true }).withMessage('Start date is required'),
    check('endDate').exists({ checkFalsy: true }).withMessage('End date is required'),
    handleValidationErrors
]

const validateGetSpots = [
    check('page').optional({nullable: true, checkFalsy: true}).isInt({gte: 1}).withMessage('Page must be greater than or equal to 1'),
    check('size').optional({nullable: true, checkFalsy: true}).isInt({gte: 1}).withMessage('Size must be greater than or equal to 1'),
    check('maxLat').optional({nullable: true, checkFalsy: true}).isInt().withMessage('Maximum latitude is invalid'),
    check('minLat').optional({nullable: true, checkFalsy: true}).isInt().withMessage('Minimum latitude is invalid'),
    check('maxLng').optional({nullable: true, checkFalsy: true}).isInt().withMessage('Maximum longitude is invalid'),
    check('minLng').optional({nullable: true, checkFalsy: true}).isInt().withMessage('Minimum longitude is invalid'),
    check('maxPrice').optional({nullable: true, checkFalsy: true}).isInt({gte: 0}).withMessage('Maximum price must be greater than or equal to 0'),
    check('minPrice').optional({nullable: true, checkFalsy: true}).isInt({gte: 0}).withMessage('Minimum price must be greater than or equal to 0'),
    handleValidationErrors
]

module.exports = {
    validateSignUp,
    validateCreateSpot,
    validateLogin,
    validateSpotImage,
    validateReview,
    validateReviewImage,
    validateBooking,
    validateGetSpots
}
