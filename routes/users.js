const express = require("express");

const {
	createUser,
	getUser,
	getUsers,
	updateUser,
	deleteUser,
	loginUser,
} = require("../controllers/users");

const router = express.Router();

// STUB: connect to a route
router.route("/login").post(loginUser);

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
