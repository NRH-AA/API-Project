const express = require('express')
const router = express.Router();

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const { User } = require('../../db/models');


// Log in
const { validateLogin } = require('./validations');
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;
  let user = await User.login({ credential, password });
  
  if (!user) {
      const err = Error('Bad request.');
      err.title = 'Bad request.';
      err.errors = ["Invalid credentials"];
      err.status = 400;
      
      return res.status(400).json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
      });
  };
  
  await setTokenCookie(res, user);

  return res.json({ user: user});
});

// Log out
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

// Restore session user
router.get('/', restoreUser, (req, res) => {
    const { user } = req;
    
    if (!user) return res.json({ user: null })
    
    return res.json({user: user.toSafeObject()});
});


module.exports = router;
