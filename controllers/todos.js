const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Todo = require("../models/Todo");
const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");

// @desc    Get all todos
// @route   GET /api/v1/todos
// @access  Public
exports.getTodos = asyncHandler(async (req, res, next) => {

	const todos = await Todo.find();

	return res.status(200).json({
		success: true,
		count: todos.length,
		data: todos,
	});
});

// TODO: stopped here
// we need a way to get the active & completed todos for a user

// @desc    Get user todos
// @route   GET /api/v1/users/:userId/todos
// @access  Public
exports.getTodosByUserId = asyncHandler(async (req, res, next) => {
	// STUB: get todos associated with a user
	// else get all todos
	// console.log(req.query);
	if (req.params.userId) {
		const todos = await Todo.find({ user: req.params.userId });

		// if(req.query) {
			// advancedResults(Todo, req.query)
			// const todos = await Todo.find({ user: req.params.userId, status: req.query });
			
		// }

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

// @desc    delete user completed todos
// @route   DELETE /api/v1/users/:userId/todos
// @access  Private
exports.deleteUserCompletedTodos = asyncHandler(async (req, res, next) => {

	if (req.params.userId) {
		await Todo.deleteMany({ user: req.params.userId, status: 'completed' });

		res.status(200).json({
			success: true,
			data: {
				message: "todos deleted",
			},
		});
	} else {
		return next(
			new ErrorResponse(`No user with the id of ${req.params.userId}`),
			404
		);
	}

});

// @desc    get status options
// @route   GET /api/v1/todos/status
// @access  Private
exports.getTodoStatusOptions = asyncHandler(async (req, res, next) => {
	const statusOptions = await Todo.schema.path('status').options.enum;

	if (!statusOptions) {
		return next(new ErrorResponse(`Error fetching status options`), 500);
	}

	res.status(200).json({
		success: true,
		data: statusOptions,
	});
});
