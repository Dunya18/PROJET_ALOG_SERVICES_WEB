const router = require("express").Router();
const signupController = require("../../controllers/clients/signup.controller.js");

router.post("/", signupController.signup);

module.exports = router;
