const express = require("express");

const {
	addTodo,
	getTodos,
	getTodo,
	updateTodo,
	deleteTodo,
	getTodoStatusOptions,
	getTodosByUserId,
	deleteUserCompletedTodos
} = require("../controllers/todos");

const Todo = require("../models/Todo");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router.route("/").get(advancedResults(Todo, {
	path: "user",
	select: "fullname",
}), getTodos);

router.route("/").get(advancedResults(Todo, {
	path: "user",
	select: "fullname",
}), getTodosByUserId).post(addTodo).delete(deleteUserCompletedTodos);

router.route("/:id").get(getTodo).put(updateTodo).delete(deleteTodo);

router.route("/status").get(getTodoStatusOptions);

module.exports = router;
