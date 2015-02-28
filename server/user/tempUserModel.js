var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//might want more info about business
var tempUserSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: {type: String, required: true, unique: true },
  business_name: {type: String, required: true},
  password: {type: String, required: true},
  createdAt: {type: Date, expires: 3600} //expires after 3600 seconds
});