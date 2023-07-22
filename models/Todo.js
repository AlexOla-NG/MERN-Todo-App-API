const mongoose = require("mongoose");

// STUB: create todo schema
const TodoSchema = new mongoose.Schema({
	title: { type: String, required: [true, "Please add a todo title"] },
	description: { type: String },
	status: { type: String, enum: ["active", "completed"], default: "active" },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Todo", TodoSchema);
