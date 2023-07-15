const express = require("express");

const {
	createUser,
	getUser,
	getUsers,
	updateUser,
	deleteUser,
	loginUser,
} = require("../controllers/users");

const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");

// STUB: include other resource routers
const todoRouter = require("./todos");

const router = express.Router();

// STUB: re-route to other resource routers
router.use("/:userId/todos", todoRouter);

// STUB: connect to a route
router.route("/login").post(loginUser);

router
	.route("/")
	.get(advancedResults(User, "todos"), getUsers)
	.post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
