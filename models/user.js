const mongoose = require('mongoose');
const bcrypt = require  ('bcryptjs');
const config = require('../config/database');


//User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email : {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
})
//
const User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserById = function(id, cb){
  User.findId(id, cb)
}
module.exports.getUserByUserName = function(username, cb){
  const query = {username: username}
  User.findOne(query, cb)
}
module.exports.addUser = function(newUser, cb){
  bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(newUser.password, salt,(err, hash)=>{
      if(err) throw err;
      newUser.password = hash;
      newUser.save(cb);
    })
  })
}
