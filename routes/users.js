const express = require('express');
const router = express.Router();

const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

router.post('/register', (req, res, next)=>{
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });
  User.addUser(newUser, (err, user)=>{
    if(err){
      return res.json({success: false, msg: 'Failed to register user!'})
    }
    else{
      return res.json({success: true, msg: 'Succeeded to register user!'})
    }
  });
});
router.post('/authenticate', (req, res, next)=>{
  const username = req.body.username;
  const password =  req.body.password;

  User.getUserByUserName(username, (err, user)=>{
    if(err) throw err;
    if(!user){
      return res.json({
        success: false,
        msg: 'User not found.'
      })
    }
    User.comparePassword(password, user.password, (err, isMatch)=>{
      if (err) throw err;
      if (isMatch){
        // can pass user.toJSON() instead of object
        const token = jwt.sign({data:user}, config.secret,{
          expiresIn: 604800
        })
        return res.json({
            success: true,
            token: `JWT ${token}`,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          })
      }
      else { // no match
        return  res.json({
          success: false,
          msg: 'Wrong Password'
        })
      }
    })
  })//end user.getUserByUserName

  // res.send('AUTHENTICATE!')
});//end post authenticate

//to be protected vv
// passport module -> passport config -> User model method-> User mongoose Method findById().
// success, mongoose method callback triggers callback in passport config, with user object
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
  res.send("the check is good")
});


module.exports = router;
