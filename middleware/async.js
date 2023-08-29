// STUB: wrapper that resolves all promises in req, res cycle
// @params: function to wrap
// @returns: promise that resolves to function
const asyncHandler = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
