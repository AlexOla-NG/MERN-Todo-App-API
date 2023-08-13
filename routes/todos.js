const express = require("express");

const {
	addTodo,
	getTodos,
	getTodo,
	updateTodo,
	deleteTodo,
	getTodoStatusOptions,
	getTodosByUserId
} = require("../controllers/todos");

const Todo = require("../models/Todo");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router.route("/").get(advancedResults(Todo, "user"), getTodosByUserId).post(addTodo);

router.route("/").get(getTodos);

router.route("/:id").get(getTodo).put(updateTodo).delete(deleteTodo);

router.route("/status").get(getTodoStatusOptions);

module.exports = router;
