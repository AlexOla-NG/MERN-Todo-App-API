const express = require("express");

const {
	addTodo,
	getTodos,
	getTodo,
	updateTodo,
	deleteTodo,
	getTodoStatusOptions
} = require("../controllers/todos");

const Todo = require("../models/Todo");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router.route("/").get(advancedResults(Todo, "user"), getTodos).post(addTodo);

router.route("/status").get(getTodoStatusOptions);

router.route("/:id").get(getTodo).put(updateTodo).delete(deleteTodo);

module.exports = router;
