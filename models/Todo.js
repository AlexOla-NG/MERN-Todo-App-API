const mongoose = require("mongoose");
const statusEnumValues = require("../utils/statusEnumValues");


// STUB: create todo schema
const TodoSchema = new mongoose.Schema({
	title: { type: String, required: [true, "Please add a todo title"] },
	description: { type: String },
	status: { type: String, enum: statusEnumValues, default: statusEnumValues[0] },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Todo", TodoSchema);
