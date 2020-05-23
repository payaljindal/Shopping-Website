const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
	totalprice: { type : String},
	// list: [
	// 	type: Pair<int,int>
	// ],
	owner :{ type: mongoose.Types.ObjectId, required : true, ref:'User'}
});

module.exports = mongoose.model('Cart', cartSchema);