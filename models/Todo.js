const mongoose = require("mongoose");

// STUB: create todo schema
const TodoSchema = new mongoose.Schema({
	title: { type: String, required: [true, "Please add a todo title"] },
	description: { type: String },
	status: { type: String, enum: ["active", "completed"], default: "active" },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: Date.now },
});

// STUB: get status field
TodoSchema.statics.getStatusOptions = async function () {
	try {
		const statusOptions = await this.aggregate([
			{ $group: { _id: "$status" } },
		]);

		const statusValues = statusOptions.map((option) => option._id);
		return statusValues;
	} catch (error) {
		console.error("Error fetching status options:", error);
	}
};

module.exports = mongoose.model("Todo", TodoSchema);
