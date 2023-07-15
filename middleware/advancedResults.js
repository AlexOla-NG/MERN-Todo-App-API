// NOTE: middleware that handles advanced querying features

const advancedResults = (model, populate) => async (req, res, next) => {
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
	query = model.find(JSON.parse(queryStr));

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
	const total = await model.countDocuments();

	query = query.skip(startIndex).limit(limit);

	if (populate) {
		query = query.populate(populate);
	}

	// STUB: execute query
	const results = await query;

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

	res.advancedResults = {
		success: true,
		count: results.length,
		pagination,
		data: results,
	};

	next();
};

module.exports = advancedResults;
