// NOTE: controllers hold methods for handling requests and responding to them

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// TODO: stopped here
// test routes with postman

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
	let query;

	// STUB: copy req.query into a new object
	const reqQuery = { ...req.query };

	// STUB: fields to exclude
	const removeFields = ["select", "sort", "page", "limit"];

	// STUB: loop over removeFields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// STUB: create query string
	let queryStr = JSON.stringify(reqQuery);

	// STUB: create operators ($gt, $gte, $lt, $lte, $in)
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// STUB: finding resource
	query = User.find(JSON.parse(queryStr));

	// STUB: select fields
	if (req.query.select) {
		let fields = req.query.select.split(",").join(" ");
		query = query.select(fields);
	}

	// STUB: sort
	if (req.query.sort) {
		let sortBy = req.query.sort.split(",").join(" ");
		query = query.sort(sortBy);
	} else {
		query = query.sort("-createdAt"); // default sort by date in descending order
	}

	// STUB: pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await User.countDocuments();

	query = query.skip(startIndex).limit(limit);

	// STUB: execute query
	const users = await query;

	// STUB: pagination result
	let pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	res.status(200).json({
		success: true,
		count: users.length,
		pagination,
		data: users,
	});
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

	res.status(201).json({ success: true, data: user });
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
