// NOTE: custom error class that extends the default Error class
class ErrorResponse extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
	}
}

module.exports = ErrorResponse;
