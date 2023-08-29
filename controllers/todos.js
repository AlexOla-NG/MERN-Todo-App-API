const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Todo = require("../models/Todo");
const User = require("../models/User");
const statusEnumValues = require("../utils/statusEnumValues");

// @desc    Get all todos
// @route   GET /api/v1/todos
// @access  Public
exports.getTodos = asyncHandler(async (req, res, next) => {
	return res.status(200).json(res.advancedResults);
});

// @desc    Get user todos
// @route   GET /api/v1/users/:userId/todos
// @access  Public
exports.getTodosByUserId = asyncHandler(async (req, res, next) => {
	// STUB: get todos associated with a user
	if (req.params.userId) {
		const user = await User.findById(req.params.userId);

		if (!user) {
			return next(
				new ErrorResponse(`No user with the id of ${req.params.userId}`, 404)
			);
		}

		// STUB: if status is passed in as a query param, filter the todos
		if (req.query.status) {
			if (statusEnumValues.includes(req.query.status)) {
				return res.status(200).json(res.advancedResults);
			} else {
				return next(
					new ErrorResponse(`Invalid todo status '${req.query.status}' found. Todo can either be 'active' or 'completed'`, 400)
				);
			}
		}

		return res.status(200).json(res.advancedResults);

	} 
	// NOTE: if no userId is passed in this function's api route,
	// the line below will return all todos
	
	// else {
	// 	res.status(200).json(res.advancedResults);
	// }
});

// @desc    Get single todo
// @route   GET /api/v1/todos/:id
// @access  Public
exports.getTodo = asyncHandler(async (req, res, next) => {
	if (req.params.id === 'status') {
		return next()
	}
	const todo = await Todo.findById(req.params.id).populate({
		path: "user",
		select: "fullname email",
	});

	if (!todo) {
		return next(
			new ErrorResponse(`No todo with the id of ${req.params.id}`, 404)
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
			new ErrorResponse(`No todo with the id of ${req.params.id}`,
				404)
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
			new ErrorResponse(`No todo with the id of ${req.params.id}`,
				404)
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
			new ErrorResponse(`No user with the id of ${req.params.userId}`,
				404)
		);
	}

});

// @desc    get status options
// @route   GET /api/v1/todos/status
// @access  Private
exports.getTodoStatusOptions = asyncHandler(async (req, res) => {
	res.status(200).json({
		success: true,
		data: statusEnumValues,
	});
});
