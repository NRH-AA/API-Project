// backend/routes/api/users.js
const express = require('express');
const router = express.Router();

const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignUp = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required'),
  check('username')
    .isLength({ min:4 })
    .withMessage('Username must be atleast 4 characters'),
  check('username')
    .not().isEmail()
    .withMessage('Username cannot be an email'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First name is required'),
  check('firstName')
    .isLength({ min: 4 })
    .withMessage('First name must be 4 or more characters'),
  check('firstName')
    .not()
    .isEmail()
    .withMessage('First name cannot be an email'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last name is required'),
  check('lastName')
    .isLength({ min: 4 })
    .withMessage('Last name must be 4 or more characters'),
  check('lastName')
    .not()
    .isEmail()
    .withMessage('Last name cannot be an email'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
]

// Sign up
router.post('/', validateSignUp, async (req, res) => {
  const { email, firstName, lastName, password, username } = req.body;
  const user = await User.signup({ email, firstName, lastName, username, password });

  const token = await setTokenCookie(res, user);
  
  const userData = user.toJSON();
  userData.token = token;
  
  return res.json({user: userData});
});


module.exports = router;
