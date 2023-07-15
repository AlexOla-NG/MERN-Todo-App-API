// NOTE: controllers hold methods for handling requests and responding to them

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// TODO: add a route & controller for resetting password

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	// STUB: if id is properly formatted but doesn't exist, return 404 error
	if (!user)
		return next(
			new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
		);

	res.status(200).json({ success: true, data: user });
});

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Public
exports.createUser = asyncHandler(async (req, res, next) => {
	const { email, password, firstname, lastname } = req.body;

	// STUB: check if email already exists
	const user = await User.findOne({ email });

	if (user) {
		return res.status(400).json({ message: "Email already exists" });
	}

	// STUB: if email does not exist, create new user
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = new User({
		firstname,
		lastname,
		email,
		password: hashedPassword,
	});
	await newUser.save();

	res.status(201).json({ success: true, data: newUser });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true, // ensures user returned is the updated one
		runValidators: true,
	});

	// STUB: if id doesn't exist, return 400 error
	if (!user)
		return next(
			new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
		);

	res.status(200).json({ success: true, data: user });
});

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);

	// STUB: if id doesn't exist, return 400 error
	if (!user)
		return next(
			new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
		);

	res.status(200).json({ success: true, data: {} });
});

// @desc    login endpoint
// @route   POST /api/v1/users/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// STUB: check if email exists
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).json({ message: "email does not exist" });
	}

	// STUB: check if password matches
	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		return res.status(400).json({ message: "Incorrect email or password" });
	}

	// STUB: if email and password match, create JWT
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

	return res.json({ data: { token, userID: user._id } });
});
