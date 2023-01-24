const express = require('express');
const router = express.Router();

const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');


// Sign up
const { validateSignUp } = require('./validations');
router.post('/', validateSignUp, async (req, res) => {
  const { email, firstName, lastName, password, username } = req.body;
  const user = await User.signup({ email, firstName, lastName, username, password });

  const token = await setTokenCookie(res, user);
  
  const userData = user.toJSON();
  userData.token = token;
  
  return res.json({user: userData});
});


module.exports = router;
