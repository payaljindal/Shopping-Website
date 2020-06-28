const mongoose = require('mongoose');
const schema = mongoose.Schema;


// order will come from frontend, so will add later
const orderSchema = new schema({
	user : {type : schema.Types.ObjectId, ref : 'User'},
	cart : {type : Array, required : true},
	address : {type : String , required : true},
	name : {type : String , required : true},
	paymentid: {type :String , required : true},
	contact : {type: Number, required : true}

});


module.exports = mongoose.model('Order', orderSchema);

