const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Todo = require("../models/Todo");
const User = require("../models/User");

// @desc    Get all todos
// @route   GET /api/v1/users/:userId/todos
// @access  Public
exports.getTodos = asyncHandler(async (req, res, next) => {
	// STUB: get todos associated with a user
	// else get all todos
	if (req.params.userId) {
		const todos = await Todo.find({ user: req.params.userId });

		return res.status(200).json({
			success: true,
			count: todos.length,
			data: todos,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @desc    Get single todo
// @route   GET /api/v1/todos/:id
// @access  Public
exports.getTodo = asyncHandler(async (req, res, next) => {
	const todo = await Todo.findById(req.params.id).populate({
		path: "user",
		select: "fullname email",
	});

	if (!todo) {
		return next(
			new ErrorResponse(`No todo with the id of ${req.params.id}`),
			404
		);
	}

	res.status(200).json({
		success: true,
		data: todo,
	});
});

// @desc    add todo
// @route   POST /api/v1/users/:userId/todos
// @access  Private
exports.addTodo = asyncHandler(async (req, res, next) => {
	req.body.user = req.params.userId;

	const user = await User.findById(req.params.userId);

	if (!user) {
		return next(
			new ErrorResponse(`No user with the id of ${req.params.userId}`),
			404
		);
	}
	const todo = await Todo.create(req.body);

	res.status(200).json({
		success: true,
		data: todo,
	});
});

// @desc    update todo
// @route   PUT /api/v1/todos/:id
// @access  Private
exports.updateTodo = asyncHandler(async (req, res, next) => {
	let todo = await Todo.findById(req.params.id);

	if (!todo) {
		return next(
			new ErrorResponse(`No todo with the id of ${req.params.id}`),
			404
		);
	}

	todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: todo,
	});
});

// @desc    delete todo
// @route   DELETE /api/v1/todos/:id
// @access  Private
exports.deleteTodo = asyncHandler(async (req, res, next) => {
	const todo = await Todo.findById(req.params.id);

	if (!todo) {
		return next(
			new ErrorResponse(`No todo with the id of ${req.params.id}`),
			404
		);
	}

	await todo.deleteOne();

	res.status(200).json({
		success: true,
		data: {
			message: "todo deleted",
		},
	});
});
