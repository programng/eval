var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

userSchema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) {
    return next();
  }

  var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  user.password = bcrypt.hashSync(user.password, salt);
  next();
});

// Change when releasing/ clear DB before
module.exports = mongoose.model('User', userSchema);
