const mongoose = require('mongoose');
const schema = mongoose.Schema;


const orderSchema = new schema({
	user : {type : schema.Types.ObjectId, ref : 'User'},
	cart : {type : Array, required : true},
	address : {type : String , required : true},
	name : {type : String , required : true},
	paymentid: {type :String , required : true},
	contact : {type: Number, required : true},
	delivered : {type : Boolean},

});


module.exports = mongoose.model('Order', orderSchema);

