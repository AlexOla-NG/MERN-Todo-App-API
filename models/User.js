const mongoose = require("mongoose");

// STUB: create user schema
const UserSchema = new mongoose.Schema({
	firstname: { type: String, required: [true, "Please add a first name"] },
	lastname: { type: String, required: [true, "Please add a last name"] },
	email: {
		type: String,
		required: [true, "Please add an email"],
		unique: true,
	},
	password: { type: String, required: [true, "Please add a password"] },
	createdAt: { type: Date, default: Date.now },
	todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "todo" }],
});

// STUB: create fullname field from the first & last name
UserSchema.pre("save", function (next) {
	this.fullname = `${this.firstname} ${this.lastname}`;
	next();
});

// STUB: connect schema to users collection
module.exports = mongoose.model("User", UserSchema);
