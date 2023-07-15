const mongoose = require("mongoose");

// STUB: create user schema
const UserSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: [true, "Please add a first name"],
		},
		lastname: { type: String, required: [true, "Please add a last name"] },
		fullname: String,
		email: {
			type: String,
			required: [true, "Please add an email"],
			unique: true,
		},
		password: { type: String, required: [true, "Please add a password"] },
		createdAt: { type: Date, default: Date.now },
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// STUB: create fullname field from the first & last name
UserSchema.pre("save", function (next) {
	this.fullname = `${this.firstname} ${this.lastname}`;
	next();
});

// STUB: cascade delete todos when a user is deleted
UserSchema.pre("remove", async function (next) {
	await this.model("Todo").deleteMany({ user: this._id });
	next();
});

// STUB: reverse populate with virtuals
UserSchema.virtual("todos", {
	ref: "Todo",
	localField: "_id",
	foreignField: "user",
});

// STUB: connect schema to users collection
module.exports = mongoose.model("User", UserSchema);
