const express = require('express')
const router = express.Router();

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const { User } = require('../../db/models');


// Log in
const { validateLogin } = require('./validations');
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;
  let user = await User.login({ credential, password });
  
  if (!user) res.status(400).json({ user: null});
  
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
