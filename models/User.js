var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	email: {type: String, unique: true},
	username: {type: String, unique: true},
	password: {type: String},
	token: {type: String}
});

module.exports = mongoose.model("User", userSchema);