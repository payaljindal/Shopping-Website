const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name:{type: String, required :true},
	email : { type : String, required : true, unique: true},
	password : { type : String, required: true , minlength: 6},
  username : {  type : String, required : true },
  admin : { type : Number},
  cart : [],
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User',userSchema);