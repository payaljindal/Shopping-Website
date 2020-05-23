const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;

const productSchema = new schema({
	name : {type : String, required : true, unique: true},
	description : {type : String , required : true}
});

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Product',productSchema);